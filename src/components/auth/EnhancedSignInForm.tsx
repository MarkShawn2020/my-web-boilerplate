'use client';

import type { SignInFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthActions } from '@/hooks/useAuthUser';
import { SignInSchema } from '@/validations/AuthValidation';
import { ProfessionalAuthLayout } from './ProfessionalAuthLayout';
import { ProfessionalButton } from './ProfessionalButton';
import { ProfessionalInput } from './ProfessionalInput';

type EnhancedSignInFormProps = {
  redirectTo?: string;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
};

export function EnhancedSignInForm({ 
  redirectTo, 
  onSuccess, 
  onForgotPassword, 
  onSignUp 
}: EnhancedSignInFormProps) {
  const t = useTranslations('SignIn');
  const { signIn, signInWithGoogle } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 获取当前locale并构建正确的本地化路径
  const getLocalizedPath = (path: string): string => {
    const currentPath = window.location.pathname;

    // 尝试多种方式检测locale
    let locale = null;

    // 方式1: 从路径提取 (例如: /zh/sign-in -> zh)
    const localeMatch = currentPath.match(/^\/([^/]+)\//);
    if (localeMatch && localeMatch[1] && ['zh', 'en'].includes(localeMatch[1])) {
      locale = localeMatch[1];
    }

    // 方式2: 如果路径是根路径，检查HTML lang属性
    if (!locale) {
      locale = document.documentElement.lang || 'en';
    }

    // 构建本地化路径
    let localizedPath = path;
    if (locale && locale !== 'en' && !path.startsWith(`/${locale}`)) {
      localizedPath = `/${locale}${path}`;
    }

    return localizedPath;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);

      if (result.error) {
        console.error('❌ SignIn error:', result.error);
        setError('root', { message: result.error });
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        const localizedRedirectTo = getLocalizedPath(redirectTo);

        // 直接使用强制重定向，绕过中间件时序问题

        // 添加认证标记到URL，告诉中间件这是刚登录的用户
        const urlWithAuthFlag = `${localizedRedirectTo}?just_signed_in=true`;

        window.location.href = urlWithAuthFlag;
      } else {
        const localizedDashboard = getLocalizedPath('/dashboard');

        // 同样添加认证标记
        const urlWithAuthFlag = `${localizedDashboard}?just_signed_in=true`;
        window.location.href = urlWithAuthFlag;
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error);
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const redirectUrl = redirectTo ? getLocalizedPath(redirectTo) : getLocalizedPath('/dashboard');
      const fullRedirectUrl = `${window.location.origin}${redirectUrl}`;

      const result = await signInWithGoogle(fullRedirectUrl);

      if (result.error) {
        console.error('❌ Google SignIn error:', result.error);
        setError('root', { message: result.error });
      }

      // OAuth 重定向会自动处理，不需要手动重定向
    } catch (error) {
      console.error('💥 Google OAuth unexpected error:', error);
      setError('root', { message: 'Google login failed. Please try again.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const formContent = (
    <div className="space-y-6">
      {/* 全局错误信息 - Lovpen 设计系统 */}
      {errors.root && (
        <div className="p-4 text-sm border rounded-xl animate-in slide-in-from-top-2 duration-200" 
             style={{ 
               color: '#CC785C',
               backgroundColor: 'rgba(204, 120, 92, 0.1)',
               borderColor: 'rgba(204, 120, 92, 0.3)',
               borderRadius: '0.75rem',
               fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
             }}>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>{errors.root.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 邮箱输入 */}
        <ProfessionalInput
          name="email"
          type="email"
          label={t('email_label')}
          error={errors.email?.message}
          register={register}
          setValue={setValue}
          leftIcon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          }
          disabled={isLoading}
        />

        {/* 密码输入 */}
        <ProfessionalInput
          name="password"
          type="password"
          label={t('password_label')}
          error={errors.password?.message}
          register={register}
          setValue={setValue}
          leftIcon={
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          }
          disabled={isLoading}
        />

        {/* 记住我和忘记密码 - Lovpen 设计系统 */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded focus:ring-2 focus:ring-offset-2"
              style={{
                accentColor: '#D97757',
                borderColor: '#E8E6DC'
              }}
            />
            <span className="text-sm" 
                  style={{ 
                    color: '#87867F',
                    fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
                  }}>
              {t('remember_me')}
            </span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium hover:underline transition-colors"
            style={{ 
              color: '#D97757',
              fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
            }}
          >
            {t('forgot_password')}
          </button>
        </div>

        {/* 登录按钮 */}
        <ProfessionalButton
          type="submit"
          size="lg"
          isLoading={isLoading}
          className="w-full"
          leftIcon={
            !isLoading && (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
            )
          }
        >
          {isLoading ? t('signing_in') : t('sign_in_button')}
        </ProfessionalButton>
      </form>

      {/* 分隔线 - Lovpen 设计系统 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: '#E8E6DC' }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4" 
                style={{ 
                  backgroundColor: '#F9F9F7',
                  color: '#87867F',
                  fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
                }}>
            {t('or')}
          </span>
        </div>
      </div>

      {/* 社交登录按钮 */}
      <div className="space-y-3">
        <ProfessionalButton
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          disabled={isLoading || isGoogleLoading}
          leftIcon={
            !isGoogleLoading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )
          }
        >
          {isGoogleLoading ? '正在连接 Google...' : '使用 Google 登录'}
        </ProfessionalButton>

        <ProfessionalButton
          variant="outline"
          size="lg"  
          className="w-full"
          leftIcon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
            </svg>
          }
        >
          使用微信登录
        </ProfessionalButton>
      </div>

      {/* 注册链接 - Lovpen 设计系统 */}
      <div className="text-center">
        <p className="text-sm" 
           style={{ 
             color: '#87867F',
             fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
           }}>
          {t('no_account')}
          {' '}
          <button
            type="button"
            onClick={onSignUp}
            className="font-medium hover:underline transition-colors"
            style={{ 
              color: '#D97757',
              fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
            }}
          >
            {t('sign_up_link')}
          </button>
        </p>
      </div>
    </div>
  );

  return (
    <ProfessionalAuthLayout
      title={t('title')}
      subtitle={t('subtitle')}
      brandSection={
        <div className="text-center text-sm" 
             style={{ 
               color: 'rgba(249, 249, 247, 0.8)',
               fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
             }}>
          <p>已有超过 <span className="font-semibold" style={{ color: '#F9F9F7' }}>10,000+</span> 创作者选择 Neurora</p>
        </div>
      }
    >
      {formContent}
    </ProfessionalAuthLayout>
  );
}