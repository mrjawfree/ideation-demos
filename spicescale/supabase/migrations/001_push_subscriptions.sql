create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  daily_reminder boolean not null default true,
  weekly_meal_plan boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_push_subscriptions_user on push_subscriptions (user_id);
create index idx_push_subscriptions_daily on push_subscriptions (daily_reminder) where daily_reminder = true;
create index idx_push_subscriptions_weekly on push_subscriptions (weekly_meal_plan) where weekly_meal_plan = true;

alter table push_subscriptions enable row level security;

create policy "anon_insert" on push_subscriptions
  for insert to anon with check (true);

create policy "anon_update_own" on push_subscriptions
  for update to anon using (true) with check (true);

create policy "anon_delete_own" on push_subscriptions
  for delete to anon using (true);

create policy "service_role_all" on push_subscriptions
  for all to service_role using (true) with check (true);
