create table if not exists users (
  id uuid primary key,
  username text unique,
  email text unique,
  telegram_handle text,
  billing_customer_id text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key,
  owner_user_id uuid references users(id) on delete cascade,
  name text not null,
  template_name text not null default 'artemis',
  purpose text not null,
  description text,
  persona jsonb not null default '{}'::jsonb,
  system_prompt text not null,
  communication_channels jsonb not null default '[]'::jsonb,
  group_behavior_mode text not null default 'mention_only',
  allowed_tools jsonb not null default '[]'::jsonb,
  knowledge_config jsonb not null default '{}'::jsonb,
  memory_policy jsonb not null default '{}'::jsonb,
  model_profile jsonb not null default '{}'::jsonb,
  status text not null default 'provisioning',
  creation_fee_paid boolean not null default false,
  monthly_price_cents integer not null default 0,
  api_bucket_balance_cents integer not null default 0,
  spend_cap_daily_cents integer,
  pause_on_zero_balance boolean not null default true,
  runtime_session_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  renewal_at timestamptz
);

create table if not exists subscriptions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  provider text not null,
  provider_subscription_id text,
  status text not null default 'pending',
  monthly_price_cents integer not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists usage_events (
  id uuid primary key,
  agent_id uuid not null references agents(id) on delete cascade,
  owner_user_id uuid not null references users(id) on delete cascade,
  event_type text not null,
  provider text,
  model text,
  input_tokens integer default 0,
  output_tokens integer default 0,
  tool_calls integer default 0,
  cost_estimate_cents integer not null default 0,
  bucket_delta_cents integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
