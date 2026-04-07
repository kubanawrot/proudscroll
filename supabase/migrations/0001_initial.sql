-- Proudscroll: initial schema

create table entries (
  id           uuid primary key default gen_random_uuid(),
  year         integer not null,
  title        text not null,
  subtitle     text,
  summary      text not null,
  body         text,
  image_url    text,
  category     text check (category in ('science','medicine','art','environment','humanitarian','curiosity')),
  likes_count  integer default 0,
  status       text default 'pending' check (status in ('published','pending','rejected')),
  created_at   timestamptz default now()
);

create table likes (
  id         uuid primary key default gen_random_uuid(),
  entry_id   uuid references entries(id) on delete cascade,
  client_id  text not null,
  created_at timestamptz default now(),
  unique(entry_id, client_id)
);

-- Fast year lookups sorted by likes
create index entries_year_likes on entries(year, likes_count desc) where status = 'published';

-- Distinct years with published entries (for navigation)
create view published_years as
  select distinct year from entries where status = 'published' order by year desc;

-- Trigger: keep likes_count in sync
create or replace function increment_likes_count()
returns trigger language plpgsql as $$
begin
  update entries set likes_count = likes_count + 1 where id = NEW.entry_id;
  return NEW;
end;
$$;

create trigger on_like_insert
  after insert on likes
  for each row execute function increment_likes_count();
