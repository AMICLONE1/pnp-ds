-- Track gateway references for host payments so Razorpay verification can be idempotent.
ALTER TABLE public.host_payments
ADD COLUMN IF NOT EXISTS gateway_order_id TEXT,
ADD COLUMN IF NOT EXISTS gateway_payment_id TEXT,
ADD COLUMN IF NOT EXISTS gateway_signature TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_host_payments_gateway_order_id
    ON public.host_payments(gateway_order_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_host_payments_gateway_payment_id
    ON public.host_payments(gateway_payment_id);