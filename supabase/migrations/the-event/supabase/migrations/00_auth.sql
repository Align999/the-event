-- Create profiles table
create table public.profiles (
  id uuid references auth.users primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );
