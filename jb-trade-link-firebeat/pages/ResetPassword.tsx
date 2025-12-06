import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Input, Card } from '../components/ui/Elements';

export const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase sends password recovery tokens in multiple ways
        const checkSession = async () => {
            try {
                console.log('=== Password Reset Token Detection ===');
                console.log('Full URL:', window.location.href);
                console.log('Hash:', window.location.hash);
                console.log('Search:', window.location.search);

                // Method 1: Check URL hash params (e.g., #access_token=xxx&type=recovery)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));

                // Method 2: Check URL search/query params (e.g., ?access_token=xxx&type=recovery)
                const searchParams = new URLSearchParams(window.location.search);

                // Method 3: Check if hash contains another hash (Supabase sometimes does this)
                // e.g., /#/reset-password#access_token=xxx
                let secondHashParams = new URLSearchParams();
                const hashParts = window.location.hash.split('#');
                if (hashParts.length > 2) {
                    secondHashParams = new URLSearchParams(hashParts[2]);
                }

                // Try to get tokens from any of these sources
                const accessToken =
                    hashParams.get('access_token') ||
                    searchParams.get('access_token') ||
                    secondHashParams.get('access_token');

                const refreshToken =
                    hashParams.get('refresh_token') ||
                    searchParams.get('refresh_token') ||
                    secondHashParams.get('refresh_token');

                const type =
                    hashParams.get('type') ||
                    searchParams.get('type') ||
                    secondHashParams.get('type');

                console.log('Detected tokens:', {
                    type,
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
                    accessTokenPreview: accessToken ? accessToken.substring(0, 20) + '...' : null
                });

                if (type === 'recovery' && accessToken) {
                    console.log('✅ Password recovery link detected, setting session...');

                    // Set the session using the tokens from the URL
                    const { data, error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || ''
                    });

                    if (error) {
                        console.error('❌ Error setting session:', error);
                        setError(`Failed to validate reset link: ${error.message}. Please request a new one.`);
                        return;
                    }

                    if (data.session) {
                        console.log('✅ Session established successfully');
                        console.log('User:', data.session.user.email);
                        setIsValidToken(true);

                        // Clean up URL (remove tokens from address bar for security)
                        window.history.replaceState({}, document.title, '/#/reset-password');
                    } else {
                        console.log('⚠️ No session created despite valid tokens');
                        setError('Invalid or expired reset link. Please request a new one.');
                    }
                } else {
                    console.log('⚠️ No recovery token in URL');

                    // No recovery token in URL, check if there's an existing session
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session) {
                        console.log('✅ Existing session found, allowing password reset');
                        setIsValidToken(true);
                    } else {
                        console.log('❌ No recovery token and no existing session');
                        setError('Invalid or expired reset link. Please request a new password reset email from the login page.');
                    }
                }
            } catch (err) {
                console.error('❌ Error checking session:', err);
                setError('An error occurred while validating the reset link. Please try again or request a new reset email.');
            }
        };

        checkSession();
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            setSuccess('Password updated successfully! Redirecting to login...');

            // Sign out and redirect to login after 2 seconds
            setTimeout(async () => {
                await supabase.auth.signOut();
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to update password');
            setIsSubmitting(false);
        }
    };

    if (!isValidToken && !error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-gray-600 text-sm">Validating reset link...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md p-6" title="">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Enter your new password</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded text-sm mb-4 border border-green-100">
                        {success}
                    </div>
                )}

                {isValidToken && !success ? (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
                        />

                        <div className="text-xs text-gray-500">
                            <p className="mb-1">Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                                    At least 8 characters
                                </li>
                                <li className={newPassword === confirmPassword && newPassword ? 'text-green-600' : ''}>
                                    Passwords match
                                </li>
                            </ul>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isSubmitting}>
                            Update Password
                        </Button>
                    </form>
                ) : error ? (
                    <div className="text-center">
                        <Button
                            onClick={() => navigate('/login')}
                            className="w-full"
                        >
                            Back to Login
                        </Button>
                    </div>
                ) : null}
            </Card>
        </div>
    );
};
