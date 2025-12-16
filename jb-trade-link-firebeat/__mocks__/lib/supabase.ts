/**
 * Supabase Client Mock for Jest Testing
 */

export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
  },
};

export const mockAuthStateChangeCallback = jest.fn();

export const supabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    signInWithPassword: jest.fn().mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    }),
    signOut: jest.fn().mockResolvedValue({
      error: null,
    }),
    onAuthStateChange: jest.fn((callback) => {
      mockAuthStateChangeCallback.mockImplementation(callback);
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      };
    }),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
    insert: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
    update: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
    delete: jest.fn().mockResolvedValue({
      data: null,
      error: null,
    }),
  })),
};

// Helper to simulate auth state changes
export const simulateSignIn = () => {
  mockAuthStateChangeCallback('SIGNED_IN', mockSession);
};

export const simulateSignOut = () => {
  mockAuthStateChangeCallback('SIGNED_OUT', null);
};

export const simulateTokenRefresh = () => {
  mockAuthStateChangeCallback('TOKEN_REFRESHED', mockSession);
};

export default supabase;
