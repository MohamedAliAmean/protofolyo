-- Run this in Supabase SQL Editor

alter table visitors
  add column if not exists total_time_seconds int not null default 0;

create table if not exists visitor_section_times (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null references visitors(id) on delete cascade,
  section text not null,
  duration_seconds int not null default 0,
  unique (visitor_id, section)
);

create index if not exists visitor_section_times_visitor_id_idx
  on visitor_section_times(visitor_id);

alter table visitor_section_times enable row level security;

create policy "Admin read visitor section times"
on visitor_section_times for select
using (auth.role() = 'authenticated');
