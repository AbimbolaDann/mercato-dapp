create or replace function public.get_investor_portfolio_summary(p_investor_id uuid)
returns table (
  total_deployed numeric,
  active_capital numeric,
  completed_principal numeric,
  pending_yield_at_maturity numeric,
  accrued_yield numeric,
  realized_yield numeric,
  weighted_apr numeric,
  deal_count integer,
  active_count integer,
  completed_count integer,
  open_escrows_by_smb jsonb
)
language sql
stable
as $$
  with investor_deals as (
    select * from public.deals where investor_id = p_investor_id
  ),
  escrow_counts as (
    select d.pyme_id, count(*) as open_count
    from public.deals d
    where d.status in ('funded', 'in_progress')
      and d.pyme_id in (select distinct pyme_id from investor_deals where pyme_id is not null)
    group by d.pyme_id
  )
  select
    coalesce(sum(id.amount), 0),
    coalesce(sum(id.amount) filter (where id.status in ('funded','in_progress')), 0),
    coalesce(sum(id.amount) filter (where id.status = 'completed'), 0),
    coalesce(sum(id.amount * id.interest_rate / 100) filter (where id.status in ('funded','in_progress')), 0),
    coalesce(sum(
      id.amount * (id.interest_rate / 100)
        * least(id.term_days, extract(epoch from (now() - id.funded_at)) / 86400) / id.term_days
    ) filter (where id.status in ('funded','in_progress') and id.funded_at is not null and id.term_days > 0 and id.interest_rate > 0), 0),
    coalesce(sum(id.amount * id.interest_rate / 100) filter (where id.status = 'completed'), 0),
    case when coalesce(sum(id.amount) filter (where id.status in ('funded','in_progress')), 0) > 0
      then sum(id.amount * id.interest_rate) filter (where id.status in ('funded','in_progress'))
           / sum(id.amount) filter (where id.status in ('funded','in_progress'))
      else 0 end,
    count(*)::int,
    count(*) filter (where id.status in ('funded','in_progress'))::int,
    count(*) filter (where id.status = 'completed')::int,
    coalesce((select jsonb_object_agg(pyme_id, open_count) from escrow_counts), '{}'::jsonb)
  from investor_deals id;
$$;

grant execute on function public.get_investor_portfolio_summary(uuid) to authenticated;
