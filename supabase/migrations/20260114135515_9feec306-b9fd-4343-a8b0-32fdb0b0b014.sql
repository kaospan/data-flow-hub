-- Conversation History Table - Stores chat threads with full provenance
CREATE TABLE public.conversation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Thread grouping
  thread_id UUID NOT NULL DEFAULT gen_random_uuid(),
  
  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Metadata for tool calls, extracted facts, etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversation_org ON public.conversation_history(organization_id);
CREATE INDEX idx_conversation_patient ON public.conversation_history(patient_id);
CREATE INDEX idx_conversation_thread ON public.conversation_history(thread_id);
CREATE INDEX idx_conversation_created ON public.conversation_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view conversations in their organization"
  ON public.conversation_history FOR SELECT
  USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert conversations in their organization"
  ON public.conversation_history FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id(auth.uid()));

-- Enable realtime for conversation history
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_history;