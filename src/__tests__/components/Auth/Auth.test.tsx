import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import SignIn from '@/components/Auth/SignIn';
import SignUp from '@/components/Auth/SignUp';
import Profile from '@/components/Auth/Profile';
import { supabase } from '@/lib/supabaseClient';

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null,
      }),
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null,
      }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'test-user-id',
              username: 'testuser',
              full_name: 'Test User',
            },
            error: null,
          }),
        }),
      }),
      upsert: jest.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

describe('Authentication Components', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  describe('SignIn Component', () => {
    it('renders signin form', () => {
      render(<SignIn />);
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('handles successful login', async () => {
      render(<SignIn />);

      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
          target: { value: 'password123' },
        });
        fireEvent.submit(screen.getByRole('form')); // Ensure the form has role="form"
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('handles login error', async () => {
      const mockError = new Error('Invalid credentials');
      jest.spyOn(supabase.auth, 'signInWithPassword').mockRejectedValueOnce(mockError);

      render(<SignIn />);

      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
          target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
          target: { value: 'wrongpassword' },
        });
        fireEvent.submit(screen.getByRole('form')); // Ensure the form has role="form"
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument(); // Case-insensitive match
      });
    });
  });

  describe('SignUp Component', () => {
    it('validates password match', async () => {
      render(<SignUp />);

      await act(async () => {
        fireEvent.change(screen.getByPlaceholderText(/^password/i), {
          target: { value: 'password123' },
        });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
          target: { value: 'password124' },
        });
        fireEvent.submit(screen.getByRole('form')); // Ensure the form has role="form"
      });

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument(); // Case-insensitive match
      });
    });
  });

  describe('Profile Component', () => {
    it('renders profile form with user data', async () => {
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      });
    });

    it('handles profile update', async () => {
      render(<Profile />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/username/i), {
          target: { value: 'newusername' },
        });
        fireEvent.click(screen.getByRole('button', { name: /save/i }));
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });
  });
});