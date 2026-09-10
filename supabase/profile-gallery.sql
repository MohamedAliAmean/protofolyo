-- Run this in Supabase SQL Editor

alter table profile
  add column if not exists gallery_urls jsonb default '[]'::jsonb;
