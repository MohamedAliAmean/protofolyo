-- Run this in Supabase SQL Editor

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_session text not null unique,
  visitor_name text,
  visitor_email text,
  last_message_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'admin')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists chat_messages_conversation_id_idx on chat_messages(conversation_id);
create index if not exists conversations_last_message_at_idx on conversations(last_message_at desc);

alter table conversations enable row level security;
alter table chat_messages enable row level security;

create policy "Admin manage conversations"
on conversations for all
using (auth.role() = 'authenticated');

create policy "Admin manage chat messages"
on chat_messages for all
using (auth.role() = 'authenticated');
