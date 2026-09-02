alter table if exists public.profiles
  add column if not exists wallet_provider text,
  add column if not exists pollar_wallet_id text,
  add column if not exists stellar_public_key text,
  add column if not exists wallet_status text;

comment on column public.profiles.wallet_provider is 'Wallet provider currently associated with the user profile.';
comment on column public.profiles.pollar_wallet_id is 'Pollar wallet identifier used for embedded wallet activation and status tracking.';
comment on column public.profiles.stellar_public_key is 'Normalized Stellar public key for the connected wallet.';
comment on column public.profiles.wallet_status is 'Wallet lifecycle status: pending or active.';
