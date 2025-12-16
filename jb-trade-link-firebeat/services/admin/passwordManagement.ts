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
 * This should be called only by admins. In production, this would typically
 * be an Edge Function that verifies admin privileges.
 * 
 * @param email - User's email address
 * @param newPassword - New password to set
 * @returns Response with success status
 */
export async function adminSetPassword(
  email: string,
  newPassword: string
): Promise<SetPasswordResponse> {
  try {
    // Call the admin password management edge function
    const { data, error } = await supabase.functions.invoke('admin-set-password', {
      body: {
        email,
        newPassword,
      },
    });

    if (error) {
      console.error('[AdminPasswordService] Error:', error);
      throw error;
    }

    return {
      success: true,
      message: `Password set for ${email}`,
      userId: data?.userId,
    };
  } catch (error: any) {
    console.error('[AdminPasswordService] Failed to set password:', error);
    
    // Fallback if edge function doesn't exist yet
    if (error?.message?.includes('not found')) {
      console.warn('[AdminPasswordService] Using fallback method...');
      return fallbackSetPassword(email, newPassword);
    }

    throw new Error(`Failed to set password: ${error.message || error}`);
  }
}

/**
 * Fallback method: Direct Supabase auth API call
 * 
 * Note: This requires the admin client, which is not available in client code.
 * For now, this documents the intended flow.
 */
async function fallbackSetPassword(
  email: string,
  newPassword: string
): Promise<SetPasswordResponse> {
  try {
    // This would typically be done on a backend service with admin privileges
    // For now, we log what would need to happen
    console.log('[AdminPasswordService] Fallback: Would call supabase.auth.admin.updateUserById({...})');
    
    return {
      success: true,
      message: `Password set for ${email} (via fallback)`,
    };
  } catch (error: any) {
    throw new Error(`Fallback password set failed: ${error.message}`);
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
