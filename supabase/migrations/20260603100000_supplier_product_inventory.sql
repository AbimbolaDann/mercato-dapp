-- Inventory fields for supplier catalog / stock management
alter table public.supplier_products
  add column if not exists sku text,
  add column if not exists unit text not null default 'unit',
  add column if not exists stock_quantity integer not null default 0,
  add column if not exists reserved_quantity integer not null default 0,
  add column if not exists reorder_point integer not null default 0;

alter table public.supplier_products
  drop constraint if exists supplier_products_stock_quantity_nonneg;

alter table public.supplier_products
  add constraint supplier_products_stock_quantity_nonneg
  check (stock_quantity >= 0);

alter table public.supplier_products
  drop constraint if exists supplier_products_reserved_quantity_nonneg;

alter table public.supplier_products
  add constraint supplier_products_reserved_quantity_nonneg
  check (reserved_quantity >= 0);

alter table public.supplier_products
  drop constraint if exists supplier_products_reorder_point_nonneg;

alter table public.supplier_products
  add constraint supplier_products_reorder_point_nonneg
  check (reorder_point >= 0);

alter table public.supplier_products
  drop constraint if exists supplier_products_reserved_lte_stock;

alter table public.supplier_products
  add constraint supplier_products_reserved_lte_stock
  check (reserved_quantity <= stock_quantity);

create index if not exists supplier_products_sku_idx on public.supplier_products (supplier_id, sku)
  where sku is not null;

comment on column public.supplier_products.sku is 'Optional SKU / internal product code';
comment on column public.supplier_products.unit is 'Unit of measure (unit, kg, box, etc.)';
comment on column public.supplier_products.stock_quantity is 'Units on hand';
comment on column public.supplier_products.reserved_quantity is 'Units reserved for active deals (manual until deal sync)';
comment on column public.supplier_products.reorder_point is 'Alert when available quantity is at or below this level';
