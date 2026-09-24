-- Kira Feature 3 — Credit Card Management FK covering index

create index if not exists credit_cards_user_id_idx
    on public.credit_cards (user_id);
