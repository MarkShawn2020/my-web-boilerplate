'use client';

import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
import { ResetPasswordForm } from './ResetPasswordForm';

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

  if (mode === 'reset') {
    return (
      <ResetPasswordForm
        onSuccess={() => setMode('signin')}
        onBack={() => setMode('signin')}
      />
    );
  }

  return (
    <AuthForm
      mode={mode}
      redirectTo={redirectTo}
      onSuccess={onSuccess}
      onModeChange={(newMode) => setMode(newMode)}
      onForgotPassword={() => setMode('reset')}
    />
  );
}
