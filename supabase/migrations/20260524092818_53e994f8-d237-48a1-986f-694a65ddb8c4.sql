
create type public.service_status as enum ('pending','in_progress','completed','cancelled');
create type public.service_category as enum ('cleaning','plumbing','electrical','appliance','painting','pest_control','other');

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category service_category not null default 'other',
  address text not null,
  preferred_time timestamptz,
  status service_status not null default 'pending',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_requests_user_id_idx on public.service_requests(user_id);
create index service_requests_status_idx on public.service_requests(status);

alter table public.service_requests enable row level security;

create policy "own_select" on public.service_requests for select using (auth.uid() = user_id);
create policy "own_insert" on public.service_requests for insert with check (auth.uid() = user_id);
create policy "own_update" on public.service_requests for update using (auth.uid() = user_id);
create policy "own_delete" on public.service_requests for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_service_requests_updated
before update on public.service_requests
for each row execute function public.set_updated_at();
