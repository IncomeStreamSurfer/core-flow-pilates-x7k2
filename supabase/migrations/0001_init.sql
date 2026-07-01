-- Core & Flow Pilates Studio — initial schema
-- Run this once against your Supabase project (SQL editor or `supabase db push`).

-- ============================================================
-- CANONICAL CONTENT TABLES
-- ============================================================

create table if not exists content (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text not null,
  excerpt text,
  cover_image_url text,
  tags text[] default '{}',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  meta_title text,
  meta_description text,
  body_html text,
  schema_type text,
  schema_data jsonb,
  og_image_url text,
  published_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  author_image_url text,
  quote text not null,
  rating integer,
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  page_slug text references pages(slug) on delete cascade,
  question text not null,
  answer_html text not null,
  sort_order integer default 0
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source_ip text,
  created_at timestamptz default now()
);

-- ============================================================
-- STUDIO-SPECIFIC TABLES
-- ============================================================

-- Class types (Reformer, Mat, Prenatal, Barre Fusion, Private Sessions)
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  body_html text,
  duration_minutes integer not null default 50,
  price_cents integer not null,
  currency text default 'usd',
  level text,
  max_capacity integer default 8,
  image_url text,
  meta_title text,
  meta_description text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Instructors
create table if not exists instructors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text,
  specialties text[] default '{}',
  short_bio text,
  bio text,
  certifications text[] default '{}',
  image_url text,
  sort_order integer default 0,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Scheduled class sessions (the bookable calendar)
create table if not exists class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade not null,
  instructor_id uuid references instructors(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 8,
  booked_count integer not null default 0,
  status text not null default 'scheduled', -- scheduled | cancelled | full
  created_at timestamptz default now()
);

-- Bookings (created after Stripe checkout.session.completed)
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  class_session_id uuid references class_sessions(id) on delete set null,
  class_id uuid references classes(id) on delete set null,
  class_name text,               -- denormalized snapshot, survives even if class_sessions isn't seeded
  instructor_name text,
  session_starts_at timestamptz, -- denormalized snapshot of the booked slot's start time
  session_ends_at timestamptz,
  customer_name text,
  customer_email text,
  customer_phone text,
  amount_total_cents integer,
  currency text default 'usd',
  status text not null default 'pending', -- pending | paid | cancelled | refunded
  booking_ref text,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_class_sessions_class_id on class_sessions(class_id);
create index if not exists idx_class_sessions_starts_at on class_sessions(starts_at);
create index if not exists idx_bookings_class_session_id on bookings(class_session_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table content enable row level security;
create policy "public read published content" on content
  for select to anon, authenticated using (published_at is not null);

alter table pages enable row level security;
create policy "public read published pages" on pages
  for select to anon, authenticated using (published_at is not null);

alter table testimonials enable row level security;
create policy "public read testimonials" on testimonials
  for select to anon, authenticated using (true);

alter table faqs enable row level security;
create policy "public read faqs" on faqs
  for select to anon, authenticated using (true);

alter table contact_messages enable row level security;
create policy "public insert contact" on contact_messages
  for insert to anon, authenticated with check (true);

alter table classes enable row level security;
create policy "public read published classes" on classes
  for select to anon, authenticated using (published_at is not null);

alter table instructors enable row level security;
create policy "public read published instructors" on instructors
  for select to anon, authenticated using (published_at is not null);

alter table class_sessions enable row level security;
create policy "public read scheduled sessions" on class_sessions
  for select to anon, authenticated using (status <> 'cancelled');

-- Bookings: NO public select policy — bookings are only ever written by
-- the Stripe webhook via the service-role client (bypasses RLS). Keeping
-- an explicit anon insert policy here too, harmless-and-explicit, matching
-- the security-baseline skill's pattern for the `orders` table.
alter table bookings enable row level security;
create policy "anon insert bookings" on bookings
  for insert to anon, authenticated with check (true);
