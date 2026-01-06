-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.files;
ALTER PUBLICATION supabase_realtime ADD TABLE public.automations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.automation_runs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usage_stats;