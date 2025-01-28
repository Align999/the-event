-- Events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references auth.users not null,
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location jsonb,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Guest list table
create table public.guest_list (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events not null,
  user_id uuid references auth.users not null,
  rsvp_status text,
  plus_ones integer default 0,
  dietary_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.events enable row level security;
alter table public.guest_list enable row level security;

-- Event policies
create policy "Users can create events"
  on events for insert
  with check ( auth.uid() = creator_id );

create policy "Users can view own events"
  on events for select
  using ( auth.uid() = creator_id );

create policy "Users can update own events"
  on events for update
  using ( auth.uid() = creator_id );

-- Guest list policies
create policy "Users can view guest lists of their events"
  on guest_list for select
  using ( 
    auth.uid() in (
      select creator_id from events where id = guest_list.event_id
    )
  );
