-- Run this in Supabase SQL Editor

alter table profile
  add column if not exists cv_url text;
