import { supabase } from '../../lib/supabase';
import { User } from '../../types';

/**
 * Load user profile - SIMPLE, NO RETRIES
 * Fast and straightforward
 */
export async function loadUserProfile(uid: string): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

    if (error) {
        throw new Error(`Profile load failed: ${error.message}`);
    }

    if (!data) {
        throw new Error('Profile not found');
    }

    return data as User;
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', uid)
        .select()
        .single();

    if (error) {
        throw new Error(`Profile update failed: ${error.message}`);
    }

    if (!data) {
        throw new Error('Update failed');
    }

    return data as User;
}
