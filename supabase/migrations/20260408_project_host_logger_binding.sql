-- Bind projects to hosts and data logger serials so onboarding creates the plant, host, and telemetry identity together.
ALTER TABLE public.projects
    ADD COLUMN IF NOT EXISTS host_id UUID REFERENCES public.hosts(id),
    ADD COLUMN IF NOT EXISTS data_logger_serial_id TEXT;

CREATE INDEX IF NOT EXISTS idx_projects_host_id
    ON public.projects(host_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_data_logger_serial_id
    ON public.projects(data_logger_serial_id)
    WHERE data_logger_serial_id IS NOT NULL;
