'use client';

import React, { useState } from 'react';
import { ResetPasswordForm } from './ResetPasswordForm';
import { EnhancedSignInForm } from './EnhancedSignInForm';
import { EnhancedSignUpForm } from './EnhancedSignUpForm';

type AuthMode = 'signin' | 'signup' | 'reset';

type AuthWrapperProps = {
  initialMode?: AuthMode;
  redirectTo?: string;
  onSuccess?: () => void;
};

export function AuthWrapper({
  initialMode = 'signin',
  redirectTo,
  onSuccess,
}: AuthWrapperProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  switch (mode) {
    case 'signup':
      return (
        <EnhancedSignUpForm
          redirectTo={redirectTo}
          onSuccess={onSuccess}
          onSignIn={() => handleModeChange('signin')}
        />
      );
    case 'reset':
      return (
        <ResetPasswordForm
          onSuccess={() => handleModeChange('signin')}
          onBack={() => handleModeChange('signin')}
        />
      );
    case 'signin':
    default:
      return (
        <EnhancedSignInForm
          redirectTo={redirectTo}
          onSuccess={onSuccess}
          onForgotPassword={() => handleModeChange('reset')}
          onSignUp={() => handleModeChange('signup')}
        />
      );
  }
}
