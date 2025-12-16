/**
 * Admin Password Management Service
 * 
 * Allows admins to set initial passwords for users and force password changes.
 * Uses Supabase Admin API via Edge Function.
 */

import { supabase } from '../../lib/supabase';

export interface SetPasswordRequest {
  email: string;
  newPassword: string;
  reason?: string; // 'initial' | 'reset' | 'forced_change'
}

export interface SetPasswordResponse {
  success: boolean;
  message: string;
  userId?: string;
}

/**
 * Set or reset a user's password (admin only)
 * 
 * Calls the Supabase Edge Function 'admin-update-password' which verifies
 * the caller is an admin and updates the user's password with admin privileges.
 * 
 * @param userId - User's ID (UUID)
 * @param newPassword - New password to set
 * @returns Response with success status
 */
export async function adminSetPassword(
  userId: string,
  newPassword: string
): Promise<SetPasswordResponse> {
  try {
    // Get the current session to ensure we have a valid auth token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error('Not authenticated. Please login and try again.');
    }

    // Call the admin password management edge function
    // The supabase.functions.invoke() automatically includes the session token
    const { data, error } = await supabase.functions.invoke('admin-update-password', {
      body: {
        userId,
        newPassword,
      },
    });

    if (error) {
      console.error('[AdminPasswordService] Edge function error:', error);

      // Extract error message from the error object
      let errorMessage = error.message || 'Failed to update password';

      // The error response may contain the actual error message
      if (error.context && typeof error.context.json === 'function') {
        try {
          const body = await error.context.json();
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch (e) {
          // If json() fails, try text text
        }
      }
      // Fallback for older supabase-js versions or different error structure
      else if (error.context?.body) {
        try {
          // Parse the JSON body if it exists
          const body = typeof error.context.body === 'string'
            ? JSON.parse(error.context.body)
            : error.context.body;
          if (body?.error) {
            errorMessage = body.error;
          }
        } catch (e) {
          // If not parseable, ignore
        }
      }

      throw new Error(errorMessage);
    }

    // Check if the data contains an error (edge function returned 200 but with error)
    if (data?.error) {
      throw new Error(data.error);
    }

    return {
      success: true,
      message: data?.message || 'Password set successfully',
      userId,
    };
  } catch (error: any) {
    console.error('[AdminPasswordService] Failed to set password:', error);

    // Provide user-friendly error messages for common issues
    const msg = error.message || '';

    if (msg.includes('Only admins')) {
      throw new Error('You do not have admin privileges. Only admins can set passwords.');
    }
    if (msg.includes('Invalid or expired authentication')) {
      throw new Error('Your session has expired. Please login again.');
    }
    if (msg.includes('Not authenticated')) {
      throw new Error(msg);
    }
    if (msg.includes('Failed to verify admin status')) {
      throw new Error('Could not verify your admin status. Please try again.');
    }
    if (msg.includes('Password update failed')) {
      throw new Error(msg);
    }
    if (msg.includes('Server configuration error')) {
      throw new Error('Server configuration issue. Please contact support.');
    }

    throw new Error(msg || 'Failed to set password. Please try again.');
  }
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Validation result with errors if invalid
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a random temporary password
 * 
 * @returns A random password that meets strength requirements
 */
export function generateTemporaryPassword(): string {
  const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*',
  };

  let password = '';

  // Ensure at least one of each required type
  password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
  password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
  password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];

  // Add more random characters to reach 12 characters total
  const allChars = chars.upper + chars.lower + chars.numbers;
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
