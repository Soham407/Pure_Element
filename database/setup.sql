create table public.cart_items (
  id uuid not null default gen_random_uuid (),
  cart_id uuid not null,
  product_id uuid not null,
  quantity integer not null default 1,
  created_at timestamp with time zone null default now(),
  constraint cart_items_pkey primary key (id),
  constraint cart_items_cart_id_product_id_key unique (cart_id, product_id),
  constraint cart_items_cart_id_fkey foreign KEY (cart_id) references carts (id),
  constraint cart_items_product_id_fkey foreign KEY (product_id) references products (id),
  constraint cart_items_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;

create table public.carts (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint carts_pkey primary key (id),
  constraint carts_user_id_key unique (user_id),
  constraint carts_user_id_fkey foreign KEY (user_id) references users (id)
) TABLESPACE pg_default;


create table public.categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  created_at timestamp with time zone null default now(),
  parent_id uuid null,
  show_in_nav boolean not null default true,
  sort_order integer not null default 0,
  constraint categories_pkey primary key (id),
  constraint categories_name_key unique (name),
  constraint categories_parent_id_fkey foreign KEY (parent_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists categories_parent_idx on public.categories using btree (parent_id) TABLESPACE pg_default;


create table public.products (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null,
  price numeric(10, 2) not null,
  category_id uuid not null,
  image_url text null,
  stock integer not null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint products_pkey primary key (id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (id) on delete RESTRICT,
  constraint products_price_check check ((price > (0)::numeric)),
  constraint products_stock_check check ((stock >= 0))
) TABLESPACE pg_default;

create index IF not exists products_category_idx on public.products using btree (category_id) TABLESPACE pg_default;

create trigger trg_products_updated_at BEFORE
update on products for EACH row
execute FUNCTION set_updated_at ();


create table public.users (
  id uuid not null default gen_random_uuid (),
  email text not null,
  password_hash text not null,
  role text not null default 'customer'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check (
    (
      role = any (array['customer'::text, 'admin'::text])
    )
  )
) TABLESPACE pg_default;


create table public.order_items (
  id uuid not null default gen_random_uuid (),
  order_id uuid not null,
  product_id uuid not null,
  quantity integer not null,
  price_at_purchase numeric(10, 2) not null,
  constraint order_items_pkey primary key (id),
  constraint order_items_order_id_fkey foreign KEY (order_id) references orders (id) on delete CASCADE,
  constraint order_items_product_id_fkey foreign KEY (product_id) references products (id),
  constraint order_items_price_check check ((price_at_purchase >= (0)::numeric)),
  constraint order_items_quantity_check check ((quantity > 0))
) TABLESPACE pg_default;

create index IF not exists idx_order_items_order_id on public.order_items using btree (order_id) TABLESPACE pg_default;

create index IF not exists idx_order_items_product_id on public.order_items using btree (product_id) TABLESPACE pg_default;


create table public.orders (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  total_amount numeric(10, 2) not null,
  status text not null default 'pending'::text,
  shipping_address text null,
  shipping_city text null,
  shipping_state text null,
  shipping_zip_code text null,
  shipping_country text null,
  shipping_phone text null,
  created_at timestamp with time zone null default now(),
  constraint orders_pkey primary key (id),
  constraint orders_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint orders_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'pending_payment'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  ),
  constraint orders_total_amount_check check ((total_amount >= (0)::numeric))
) TABLESPACE pg_default;

create index IF not exists idx_orders_user_id on public.orders using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_orders_created_at on public.orders using btree (created_at) TABLESPACE pg_default;

-- Reviews table
create table public.reviews (
  id uuid not null default gen_random_uuid (),
  product_id uuid not null,
  user_id uuid not null,
  rating integer not null,
  comment text null,
  created_at timestamp with time zone null default now(),
  constraint reviews_pkey primary key (id),
  constraint reviews_product_id_fkey foreign KEY (product_id) references products (id) on delete CASCADE,
  constraint reviews_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint reviews_rating_check check ((rating >= 1 and rating <= 5)),
  constraint reviews_user_product_unique unique (user_id, product_id)
) TABLESPACE pg_default;

create index IF not exists idx_reviews_product_id on public.reviews using btree (product_id) TABLESPACE pg_default;
create index IF not exists idx_reviews_user_id on public.reviews using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_reviews_created_at on public.reviews using btree (created_at) TABLESPACE pg_default;