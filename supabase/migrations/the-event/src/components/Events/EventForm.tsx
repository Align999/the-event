'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    console.log('Creating event:', { title, description, startDate, endDate });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            creator_id: user.id,
            title,
            description,
            start_date: startDate,
            end_date: endDate
          }
        ])
        .select()
        .single();

      if (error) throw error;
      console.log('Event created:', data);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
}
