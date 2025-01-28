'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4 p-4">
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="border rounded-lg p-4">
            <h3 className="font-bold">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Starts: {new Date(event.start_date).toLocaleString()}</p>
              <p>Ends: {new Date(event.end_date).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
