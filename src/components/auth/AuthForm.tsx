'use client';

import type { SignInFormData, SignUpFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthActions } from '@/hooks/useAuthUser';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { SignInSchema, SignUpSchema } from '@/validations/AuthValidation';
import { ProfessionalAuthLayout } from './ProfessionalAuthLayout';
import { ProfessionalButton } from './ProfessionalButton';
import { ProfessionalInput } from './ProfessionalInput';

// Icons
const Icons = {
  email: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  password: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  ),
  user: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  login: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  error: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  wechat: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
    </svg>
  ),
};

type AuthMode = 'signin' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
  redirectTo?: string;
  onSuccess?: () => void;
  onModeChange?: (mode: AuthMode) => void;
  onForgotPassword?: () => void;
};

type FormData = SignInFormData | SignUpFormData;

export function AuthForm({
  mode,
  redirectTo,
  onSuccess,
  onModeChange,
  onForgotPassword,
}: AuthFormProps) {
  const t = useTranslations(mode === 'signin' ? 'SignIn' : 'SignUp');
  const { signIn, signUp } = useAuthActions();
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth(redirectTo);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isSignIn = mode === 'signin';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(isSignIn ? SignInSchema : SignUpSchema),
  });

  const getLocalizedPath = (path: string): string => {
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/^\/([^/]+)\//);
    let locale = null;
    if (localeMatch && localeMatch[1] && ['zh', 'en'].includes(localeMatch[1])) {
      locale = localeMatch[1];
    }
    if (!locale) {
      locale = document.documentElement.lang || 'en';
    }
    if (locale && locale !== 'en' && !path.startsWith(`/${locale}`)) {
      return `/${locale}${path}`;
    }
    return path;
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (isSignIn) {
        const result = await signIn(data.email, data.password);
        if (result.error) {
          setError('root', { message: result.error });
          return;
        }
        if (onSuccess) {
          onSuccess();
        } else {
          const target = redirectTo ? getLocalizedPath(redirectTo) : getLocalizedPath('/dashboard');
          window.location.href = `${target}?just_signed_in=true`;
        }
      } else {
        const signUpData = data as SignUpFormData;
        const result = await signUp(signUpData.email, signUpData.password, signUpData.fullName, {
          redirectTo: redirectTo || `${window.location.origin}/dashboard`,
        });
        if (result.error) {
          setError('root', { message: result.error });
          return;
        }
        setShowSuccess(true);
        onSuccess?.();
      }
    } catch {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  // 注册成功页面
  if (!isSignIn && showSuccess) {
    return (
      <ProfessionalAuthLayout title="验证邮箱" subtitle="我们已向您发送激活链接">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{t('check_email_title')}</h2>
            <p className="text-muted-foreground text-lg">{t('check_email_message')}</p>
          </div>
          <div className="space-y-4">
            <ProfessionalButton onClick={() => onModeChange?.('signin')} variant="primary" size="lg" className="w-full" leftIcon={Icons.login}>
              {t('back_to_sign_in')}
            </ProfessionalButton>
            <ProfessionalButton variant="outline" size="md" className="w-full" onClick={() => window.open('https://mail.google.com', '_blank')}>
              打开邮箱
            </ProfessionalButton>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>没有收到邮件？请检查垃圾邮件文件夹</p>
            <button onClick={() => setShowSuccess(false)} className="text-primary font-medium hover:underline">
              重新注册
            </button>
          </div>
        </div>
      </ProfessionalAuthLayout>
    );
  }

  const formContent = (
    <div className="space-y-6">
      {/* 错误提示 */}
      {errors.root && (
        <div className="p-4 text-sm border rounded-xl animate-in slide-in-from-top-2 duration-200 bg-destructive/10 border-destructive/30 text-destructive">
          <div className="flex items-center space-x-2">
            {Icons.error}
            <span>{errors.root.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 注册：姓名 */}
        {!isSignIn && (
          <ProfessionalInput
            name="fullName"
            type="text"
            label={t('full_name_label')}
            error={(errors as any).fullName?.message}
            register={register}
            setValue={setValue}
            leftIcon={Icons.user}
            disabled={isLoading}
          />
        )}

        {/* 邮箱 */}
        <ProfessionalInput
          name="email"
          type="email"
          label={t('email_label')}
          error={errors.email?.message}
          register={register}
          setValue={setValue}
          leftIcon={Icons.email}
          disabled={isLoading}
        />

        {/* 密码 */}
        <ProfessionalInput
          name="password"
          type="password"
          label={t('password_label')}
          error={errors.password?.message}
          register={register}
          setValue={setValue}
          leftIcon={Icons.password}
          disabled={isLoading}
        />

        {/* 注册：确认密码 */}
        {!isSignIn && (
          <ProfessionalInput
            name="confirmPassword"
            type="password"
            label={t('confirm_password_label')}
            error={(errors as any).confirmPassword?.message}
            register={register}
            setValue={setValue}
            leftIcon={Icons.password}
            disabled={isLoading}
          />
        )}

        {/* 登录：记住我 + 忘记密码 */}
        {isSignIn && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-muted-foreground">{t('remember_me')}</span>
            </label>
            <button type="button" onClick={onForgotPassword} className="text-sm font-medium text-primary hover:underline">
              {t('forgot_password')}
            </button>
          </div>
        )}

        {/* 注册：服务条款 */}
        {!isSignIn && (
          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input {...register('acceptTerms' as any)} type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-primary" disabled={isLoading} />
              <span className="text-sm text-foreground">
                {t('accept_terms_part1')}{' '}
                <a href="/terms" className="font-medium text-primary hover:underline" target="_blank">{t('terms_of_service')}</a>
                {' '}{t('and')}{' '}
                <a href="/privacy" className="font-medium text-primary hover:underline" target="_blank">{t('privacy_policy')}</a>
              </span>
            </label>
            {(errors as any).acceptTerms && (
              <p className="text-sm text-destructive">{(errors as any).acceptTerms.message}</p>
            )}
          </div>
        )}

        {/* 提交按钮 */}
        <ProfessionalButton type="submit" size="lg" isLoading={isLoading} className="w-full" leftIcon={!isLoading && (isSignIn ? Icons.login : Icons.check)}>
          {isLoading ? t(isSignIn ? 'signing_in' : 'creating_account') : t(isSignIn ? 'sign_in_button' : 'sign_up_button')}
        </ProfessionalButton>
      </form>

      {/* 分隔线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">{t('or')}</span>
        </div>
      </div>

      {/* 社交登录 */}
      <div className="space-y-3">
        <ProfessionalButton
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleAuth}
          isLoading={isGoogleLoading}
          disabled={isLoading || isGoogleLoading}
          leftIcon={!isGoogleLoading && Icons.google}
        >
          {isGoogleLoading ? '正在连接 Google...' : `使用 Google ${isSignIn ? '登录' : '注册'}`}
        </ProfessionalButton>
        <ProfessionalButton variant="outline" size="lg" className="w-full" leftIcon={Icons.wechat}>
          使用微信{isSignIn ? '登录' : '注册'}
        </ProfessionalButton>
      </div>

      {/* 切换模式 */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t(isSignIn ? 'no_account' : 'have_account')}{' '}
          <button type="button" onClick={() => onModeChange?.(isSignIn ? 'signup' : 'signin')} className="font-medium text-primary hover:underline">
            {t(isSignIn ? 'sign_up_link' : 'sign_in_link')}
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
        <div className="text-center text-sm text-white/80">
          {isSignIn ? (
            <p>已有超过 <span className="font-semibold text-white">10,000+</span> 创作者选择 Lovweb</p>
          ) : (
            <div className="space-y-2">
              <p>加入 <span className="font-semibold text-white">10,000+</span> 创作者的行列</p>
              <div className="flex justify-center items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs">每分钟都有新用户注册</span>
              </div>
            </div>
          )}
        </div>
      }
    >
      {formContent}
    </ProfessionalAuthLayout>
  );
}
