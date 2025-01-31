'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestConnection() {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        // Simple query to check connection
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus('Connection failed: ' + error.message);
          console.error('Error:', error);
        } else {
          setStatus('Successfully connected to Supabase!');
          console.log('Connection successful');
        }
      } catch (err) {
        setStatus('Connection error, check console');
        console.error('Error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 m-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Supabase Connection Test</h2>
      <p className={status.includes('Success') ? 'text-green-600' : 'text-red-600'}>
        {status}
      </p>
    </div>
  );
}