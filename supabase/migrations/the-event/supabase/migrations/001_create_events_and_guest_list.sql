-- Create events table
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location jsonb,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS for events
alter table public.events enable row level security;

-- Create RLS policies for events
create policy "Users can create events"
  on events for insert
  with check ( auth.uid() = creator_id );

create policy "Users can view their own events"
  on events for select
  using ( 
    auth.uid() = creator_id or
    exists (
      select 1 from guest_list
      where event_id = events.id and user_id = auth.uid()
    )
  );

-- Create guest_list table
create table public.guest_list (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references auth.users(id) not null,
  rsvp_status text not null,
  plus_ones integer default 0,
  dietary_notes text,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS for guest_list
alter table public.guest_list enable row level security;

-- Create RLS policies for guest_list
create policy "Guests can view their own RSVPs"
  on guest_list for select
  using ( auth.uid() = user_id );

create policy "Hosts can manage guest lists for their events"
  on guest_list for all
  using (
    exists (
      select 1 from events
      where events.id = guest_list.event_id and events.creator_id = auth.uid()
    )
  );