-- Create users Table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text,
  role text, -- QA,HR,Developer
  created_at timestamptz default now()
);

-- Create Boards Table
create table if not exists boards (
  board_id uuid primary key default gen_random_uuid(),
  title text not null,
  bg_color text,
  img_url text,
  created_by uuid references users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Create Lists Table
create table if not exists lists (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(board_id) on delete cascade,
  title text not null,
  created_at timestamptz default now()
);

-- Create Cards Table
create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references lists(id) on delete cascade,
  title text not null,
  description text,
  priority text, -- High,Medium,Low
  created_at timestamptz default now()
);

-- Comments Table
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references cards(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);
