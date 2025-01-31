import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventForm from '@/components/Events/EventForm';
import { supabase } from '@/lib/supabaseClient';

// Mock Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }
}));

describe('EventForm', () => {
  beforeEach(() => {
    // Mock authentication
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: 'test-user-id' } }
    });
  });

  it('renders form fields', () => {
    render(<EventForm />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    render(<EventForm />);
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Event' }
    });
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test Description' }
    });
    
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2025-02-01T10:00' }
    });
    
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2025-02-01T12:00' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create event/i }));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('events');
    });
  });
});
