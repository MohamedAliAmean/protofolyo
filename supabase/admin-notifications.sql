-- Run this in Supabase SQL Editor

alter table site_stats
  add column if not exists last_seen_visitors_at timestamptz default now(),
  add column if not exists last_seen_messages_at timestamptz default now();
