'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

type ButtonStateConfig = {
  // 基础配置
  id: string;
  initialState?: ButtonState;

  // 权限控制
  permissions?: string[];
  requiredRole?: string;

  // 表单验证
  validationFields?: string[];
  formRef?: React.RefObject<HTMLFormElement>;

  // 状态持续时间
  successDuration?: number;
  errorDuration?: number;

  // 回调函数
  onStateChange?: (state: ButtonState, id: string) => void;
  onError?: (error: Error, id: string) => void;
  onSuccess?: (result: any, id: string) => void;
};

type AsyncActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: Error;
};

type ButtonStateReturn = {
  // 状态
  state: ButtonState;
  isLoading: boolean;
  isDisabled: boolean;
  disabledReason?: string;

  // 动作
  executeAsync: <T = any>(action: () => Promise<T>) => Promise<AsyncActionResult<T>>;
  setState: (state: ButtonState) => void;
  reset: () => void;

  // 验证
  validateForm: () => boolean;
  checkPermissions: () => boolean;
};

/**
 * 统一的按钮状态管理Hook
 * 提供loading、success、error状态管理，以及权限验证、表单验证等功能
 */
export const useButtonState = (config: ButtonStateConfig): ButtonStateReturn => {
  const [state, setState] = useState<ButtonState>(config.initialState || 'idle');
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const t = useTranslations('button_states');

  // 清理定时器
  const clearCurrentTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  // 表单验证
  const validateForm = useCallback((): boolean => {
    if (!config.formRef?.current || !config.validationFields?.length) {
      return true;
    }

    const formData = new FormData(config.formRef.current);
    const isValid = config.validationFields.every((field) => {
      const value = formData.get(field);
      return value && value.toString().trim() !== '';
    });

    return isValid;
  }, [config.formRef, config.validationFields]);

  // 权限检查
  const checkPermissions = useCallback((): boolean => {
    // 这里可以集成实际的权限检查逻辑
    // 例如检查用户角色、权限列表等
    if (config.requiredRole || config.permissions?.length) {
      // 实际实现中，这里应该检查当前用户的权限
      // 暂时返回true，实际使用时需要集成权限系统
      return true;
    }
    return true;
  }, [config.requiredRole, config.permissions]);

  // 计算禁用状态和原因
  const getDisabledState = useCallback(() => {
    const isLoading = state === 'loading';

    if (isLoading) {
      return { isDisabled: true, disabledReason: t('disabled_loading') };
    }

    if (!checkPermissions()) {
      return { isDisabled: true, disabledReason: t('disabled_permission') };
    }

    if (!validateForm()) {
      return { isDisabled: true, disabledReason: t('disabled_form_invalid') };
    }

    return { isDisabled: false, disabledReason: undefined };
  }, [state, checkPermissions, validateForm, t]);

  // 设置状态
  const setStateWithCallback = useCallback((newState: ButtonState) => {
    setState(newState);
    config.onStateChange?.(newState, config.id);

    // 自动重置成功/错误状态
    clearCurrentTimeout();

    if (newState === 'success') {
      timeoutRef.current = setTimeout(() => {
        setState('idle');
        config.onStateChange?.('idle', config.id);
      }, config.successDuration || 2000);
    } else if (newState === 'error') {
      timeoutRef.current = setTimeout(() => {
        setState('idle');
        config.onStateChange?.('idle', config.id);
      }, config.errorDuration || 3000);
    }
  }, [config, clearCurrentTimeout]);

  // 执行异步操作
  const executeAsync = useCallback(async <T = any>(
    action: () => Promise<T>,
  ): Promise<AsyncActionResult<T>> => {
    const { isDisabled } = getDisabledState();

    if (isDisabled) {
      return { success: false, error: new Error(t('disabled_loading')) };
    }

    try {
      setStateWithCallback('loading');
      const result = await action();

      setStateWithCallback('success');
      config.onSuccess?.(result, config.id);

      return { success: true, data: result };
    } catch (error) {
      const err = error as Error;
      setStateWithCallback('error');
      config.onError?.(err, config.id);

      return { success: false, error: err };
    }
  }, [getDisabledState, setStateWithCallback, config, t]);

  // 重置状态
  const reset = useCallback(() => {
    clearCurrentTimeout();
    setState(config.initialState || 'idle');
  }, [clearCurrentTimeout, config.initialState]);

  const { isDisabled, disabledReason } = getDisabledState();

  return {
    // 状态
    state,
    isLoading: state === 'loading',
    isDisabled,
    disabledReason,

    // 动作
    executeAsync,
    setState: setStateWithCallback,
    reset,

    // 验证
    validateForm,
    checkPermissions,
  };
};

/**
 * 多按钮状态管理Hook
 * 用于管理多个按钮的状态，确保同一时间只有一个按钮处于loading状态
 */
export const useMultiButtonState = (buttonStates: ButtonStateReturn[]) => {
  const t = useTranslations('button_states');

  // 检查是否有任何按钮正在loading
  const hasLoadingButton = buttonStates.some(button => button.isLoading);

  // 为每个按钮添加全局loading检查
  const enhancedStates = buttonStates.map((buttonState) => ({
    ...buttonState,
    isDisabled: buttonState.isDisabled || (hasLoadingButton && !buttonState.isLoading),
    disabledReason: buttonState.isDisabled
      ? buttonState.disabledReason
      : hasLoadingButton && !buttonState.isLoading
        ? t('disabled_other_loading')
        : undefined,
  }));

  return {
    buttons: enhancedStates,
    hasLoadingButton,
    resetAll: () => buttonStates.forEach(button => button.reset()),
  };
};

/**
 * 表单按钮状态管理Hook
 * 专门为表单提交按钮设计，集成表单验证和提交状态管理
 */
export const useFormButtonState = (
  formRef: React.RefObject<HTMLFormElement>,
  validationFields: string[] = [],
) => {
  return useButtonState({
    id: 'form-submit',
    formRef,
    validationFields,
    successDuration: 1500,
    errorDuration: 3000,
  });
};
