-- ============================================
-- HOST BILLING GATEWAY HARDENING
-- Created: 2026-04-07
-- Purpose: Add gateway metadata needed for a
-- secure monthly PPA billing and receipt flow.
-- ============================================

ALTER TABLE public.host_payments
    ADD COLUMN IF NOT EXISTS gateway_name TEXT,
    ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS gateway_signature TEXT,
    ADD COLUMN IF NOT EXISTS currency CHAR(3) DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS invoice_number TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_host_payments_gateway_order_id
    ON public.host_payments(gateway_order_id)
    WHERE gateway_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_host_payments_gateway_payment_id
    ON public.host_payments(gateway_payment_id)
    WHERE gateway_payment_id IS NOT NULL;
