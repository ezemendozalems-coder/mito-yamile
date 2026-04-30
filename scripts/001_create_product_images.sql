-- Create product_images table
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  image_path text not null,
  is_main boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(code, image_path)
);

-- Create index for fast lookups by code
create index if not exists idx_product_images_code on public.product_images(code);

-- Enable RLS
alter table public.product_images enable row level security;

-- Public read policy (anyone can view product images)
create policy "product_images_select_all" on public.product_images
  for select using (true);

-- Authenticated users can insert
create policy "product_images_insert_auth" on public.product_images
  for insert with check (auth.role() = 'authenticated');

-- Authenticated users can update
create policy "product_images_update_auth" on public.product_images
  for update using (auth.role() = 'authenticated');

-- Authenticated users can delete
create policy "product_images_delete_auth" on public.product_images
  for delete using (auth.role() = 'authenticated');
