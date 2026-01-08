create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;  
$$ language plpgsql security definer;

-- Trigger to call the function when a new user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Row Level Security on all tables
alter table users enable row level security;
alter table boards enable row level security;
alter table lists enable row level security;
alter table cards enable row level security;
alter table comments enable row level security;

-------------------------------------
-- Users Table Policies
-- Allow users to read their own profile
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on users for insert
  with check (auth.uid() = id);
------------------------------------------

-- Boards Table Policies
-- Allow users to view boards they created
create policy "Users can view their own boards"
  on boards for select
  using (auth.uid() = created_by);

-- Allow users to create boards (allows service role or authenticated user)
create policy "Users can create boards"
  on boards for insert
  with check (auth.uid() = created_by OR auth.jwt() IS NULL);

-- Allow users to update their own boards
create policy "Users can update their own boards"
  on boards for update
  using (auth.uid() = created_by);

-- Allow users to delete their own boards
create policy "Users can delete their own boards"
  on boards for delete
  using (auth.uid() = created_by);

-- Lists Table Policies
-- Allow users to view lists in their boards
create policy "Users can view lists in their boards"
  on lists for select
  using (
    exists (
      select 1 from boards
      where boards.board_id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to create lists in their boards
create policy "Users can create lists in their boards"
  on lists for insert
  with check (
    exists (
      select 1 from boards
      where boards.board_id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to update lists in their boards
create policy "Users can update lists in their boards"
  on lists for update
  using (
    exists (
      select 1 from boards
      where boards.board_id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to delete lists in their boards
create policy "Users can delete lists in their boards"
  on lists for delete
  using (
    exists (
      select 1 from boards
      where boards.board_id = lists.board_id
      and boards.created_by = auth.uid()
    )
  );

-- Cards Table Policies
-- Allow users to view cards in their boards
create policy "Users can view cards in their boards"
  on cards for select
  using (
    exists (
      select 1 from lists
      join boards on boards.board_id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to create cards in their boards
create policy "Users can create cards in their boards"
  on cards for insert
  with check (
    exists (
      select 1 from lists
      join boards on boards.board_id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to update cards in their boards
create policy "Users can update cards in their boards"
  on cards for update
  using (
    exists (
      select 1 from lists
      join boards on boards.board_id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to delete cards in their boards
create policy "Users can delete cards in their boards"
  on cards for delete
  using (
    exists (
      select 1 from lists
      join boards on boards.board_id = lists.board_id
      where lists.id = cards.list_id
      and boards.created_by = auth.uid()
    )
  );

-- Comments Table Policies
-- Allow users to view comments on cards in their boards
create policy "Users can view comments on cards in their boards"
  on comments for select
  using (
    exists (
      select 1 from cards
      join lists on lists.id = cards.list_id
      join boards on boards.board_id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to create comments on cards in their boards
create policy "Users can create comments on cards in their boards"
  on comments for insert
  with check (
    exists (
      select 1 from cards
      join lists on lists.id = cards.list_id
      join boards on boards.board_id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to update their own comments
create policy "Users can update comments on cards in their boards"
  on comments for update
  using (
    exists (
      select 1 from cards
      join lists on lists.id = cards.list_id
      join boards on boards.board_id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
  );

-- Allow users to delete comments on cards in their boards
create policy "Users can delete comments on cards in their boards"
  on comments for delete
  using (
    exists (
      select 1 from cards
      join lists on lists.id = cards.list_id
      join boards on boards.board_id = lists.board_id
      where cards.id = comments.card_id
      and boards.created_by = auth.uid()
    )
  );
