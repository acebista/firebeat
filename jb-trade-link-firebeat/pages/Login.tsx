
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../services/auth';
import { ErrorBanner } from '../components/auth/ErrorBanner';
import { Button, Input, Card } from '../components/ui/Elements';
import { supabase } from '../lib/supabase';
import { UserService } from '../services/db';
import { UserRole, User } from '../types';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const isDevRegistrationEnabled = import.meta.env.VITE_ENABLE_DEV_REGISTRATION === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('admin'); // Only used for registration
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, error: authError, isLoading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate(getDashboardPath(user.role));
    }
  }, [user, navigate]);

  // Ensure registration UI is suppressed when the feature is disabled
  React.useEffect(() => {
    if (!isDevRegistrationEnabled && isRegistering) {
      setIsRegistering(false);
    }
  }, [isDevRegistrationEnabled, isRegistering]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // Navigation will happen automatically via useEffect above
    } catch (err: any) {
      // Error is already in authError, but we can set local error for display
      setLocalError(err.message || 'Login failed');
      setIsSubmitting(false);
    }
  };

  const handleDevRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDevRegistrationEnabled) {
      setLocalError('Self-service registration is disabled. Ask an admin to create your account.');
      setIsSubmitting(false);
      setIsRegistering(false);
      return;
    }

    setLocalError('');
    setIsSubmitting(true);
    try {
      // 1. Create Authentication User
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('User creation failed');

      // 2. Check if an Admin has already created a profile for this email
      const existingUsers = await UserService.getByEmail(email);
      let roleToUse = role;
      let nameToUse = email.split('@')[0];

      // 3. Create/Overwrite the User Profile
      if (existingUsers.length > 0) {
        const existing = existingUsers[0];
        roleToUse = existing.role;
        nameToUse = existing.name;

        // Cleanup old doc if ID doesn't match Auth ID (Migration scenario)
        if (existing.id !== user.id) {
          await UserService.delete(existing.id);
        }
      }

      // Create the user profile with the auth user ID
      const newUserProfile: Omit<User, 'id'> = {
        name: nameToUse,
        email: email,
        role: roleToUse,
        isActive: true,
        createdAt: new Date().toISOString(),
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToUse)}&background=random`
      };

      // Add with explicit ID
      await UserService.add({ ...newUserProfile, id: user.id } as any);


      toast.success(`Account created successfully! Role: ${roleToUse}. You are logged in.`);
      // Auth state listener in services/auth.tsx will handle the redirection/state update
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || 'Registration failed');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!email) {
      setLocalError('Please enter your email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess('Password reset email sent! Check your inbox.');
      setEmail('');

      // Switch back to login after 3 seconds
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show main login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-6" title="">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">Firebeat</h1>
          <p className="text-gray-500">DMS (Supabase Edition)</p>
        </div>

        {(localError || authError) && (
          <>
            <ErrorBanner
              error={authError || { code: 'ERROR', message: localError, retryable: false }}
              onRetry={authError?.retryable ? () => handleLogin(new Event('submit') as any) : undefined}
              onDismiss={() => setLocalError('')}
            />
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  console.log('🚨 Manual storage clear requested');
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                    console.log('✅ Storage cleared - refreshing page...');
                    setTimeout(() => window.location.reload(), 500);
                  } catch (e) {
                    console.error('Failed to clear storage:', e);
                    toast.error('Failed to clear storage. Please try closing all tabs and reopening.');
                  }
                }}
                className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 px-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                🔄 Clear Storage & Retry
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Click this if login keeps failing. This will clear all stored data and refresh the page.
              </p>
            </div>
          </>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4 border border-green-100">
            {success}
          </div>
        )}

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-sm text-center font-bold text-gray-700">Reset Password</div>
            <p className="text-sm text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Send Reset Link
            </Button>
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setLocalError('');
                setSuccess('');
              }}
              className="w-full text-center text-sm text-gray-600 hover:underline"
            >
              Back to Login
            </button>
          </form>
        ) : isRegistering && isDevRegistrationEnabled ? (
          <form onSubmit={handleDevRegister} className="space-y-6">
            <div className="text-sm text-center font-bold text-gray-700">Dev Registration</div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role (if no admin profile exists)</label>
              <div className="flex gap-2">
                {(['admin', 'sales', 'delivery'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-3 py-1 rounded capitalize border transition-colors ${role === r ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setLocalError('');
              }}
              className="w-full text-center text-sm text-gray-600 hover:underline"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In (v3)
            </Button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setLocalError('');
                }}
                className="text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
              {isDevRegistrationEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setLocalError('');
                  }}
                  className="text-indigo-600 hover:underline"
                >
                  Register (Dev)
                </button>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
