// src/components/Auth/Profile.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
 id: string;
 username?: string;
 full_name?: string;
 avatar_url?: string;
 updated_at?: string;
}

export default function Profile() {
 const [profile, setProfile] = useState<Profile | null>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [username, setUsername] = useState('');
 const [fullName, setFullName] = useState('');
 
 useEffect(() => {
   getProfile();
 }, []);

 async function getProfile() {
   try {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('No user logged in');

     let { data, error } = await supabase
       .from('profiles')
       .select('username, full_name, avatar_url, updated_at')
       .eq('id', user.id)
       .single();

     if (error) throw error;
     
     if (data) {
       setProfile(data);
       setUsername(data.username || '');
       setFullName(data.full_name || '');
     }
   } catch (error) {
     setError(error instanceof Error ? error.message : 'Error loading profile');
   } finally {
     setLoading(false);
   }
 }

 async function updateProfile(event: React.FormEvent) {
   event.preventDefault();
   setLoading(true);
   setError(null);

   try {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error('No user logged in');

     const updates = {
       id: user.id,
       username,
       full_name: fullName,
       updated_at: new Date().toISOString(),
     };

     let { error } = await supabase.from('profiles').upsert(updates);
     if (error) throw error;
     
   } catch (error) {
     setError(error instanceof Error ? error.message : 'Error updating profile');
   } finally {
     setLoading(false);
   }
 }

 if (loading) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
     </div>
   );
 }

 return (
   <div className="max-w-2xl mx-auto py-8 px-4">
     <div className="bg-white shadow rounded-lg p-6">
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
       
       {error && (
         <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
           <p className="text-red-700">{error}</p>
         </div>
       )}

       <form onSubmit={updateProfile} className="space-y-6">
         <div>
           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
             Username
           </label>
           <input
             type="text"
             id="username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
           />
         </div>

         <div>
           <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
             Full Name
           </label>
           <input
             type="text"
             id="fullName"
             value={fullName}
             onChange={(e) => setFullName(e.target.value)}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
           />
         </div>

         <div className="pt-5">
           <button
             type="submit"
             disabled={loading}
             className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
           >
             {loading ? 'Saving...' : 'Save Profile'}
           </button>
         </div>
       </form>
     </div>
   </div>
 );
}