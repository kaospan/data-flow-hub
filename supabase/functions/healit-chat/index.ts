import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are HealIT, a medical care coordination assistant.

## HARD SAFETY RULES (NON-NEGOTIABLE)
❌ NEVER diagnose conditions or prescribe treatments
❌ NEVER impersonate clinicians  
✅ ALWAYS escalate emergencies (Israel: 101)
✅ ALWAYS defer medical judgment to humans

## YOUR ROLE
Track referrals, remind about pending actions, alert staff about non-completed tasks.

## RESPONDING WITH CONTEXT
When given conclusions and history: treat them as truth unless new evidence contradicts.
If data is from an uploaded document, label it as such.

## OUTPUT FORMAT
When you identify action items, include structured JSON:
\`\`\`json
{
  "followups": [{"category": "schedule_appointment|review_result|repeat_test|medication_check|admin_other", "description": "...", "due_in_days": 7, "priority": "low|medium|high"}],
  "conclusions": [{"type": "referral_status", "key": "unique_key", "value": {...}, "confidence": 0.9, "reasoning": "..."}]
}
\`\`\`

Respond in the same language the user writes (Hebrew/English).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, patientId, organizationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing chat message for patient:", patientId);

    // Get patient context if available
    let patientContext = "";
    if (patientId && organizationId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Get patient info
      const { data: patient } = await supabase
        .from("patients")
        .select("name, email, phone")
        .eq("id", patientId)
        .single();

      // Get current conclusions (MODULAR MEMORY)
      const { data: conclusions } = await supabase
        .from("conclusions")
        .select("conclusion_type, conclusion_key, conclusion_value, confidence, source_type")
        .eq("organization_id", organizationId)
        .eq("is_current", true)
        .or(`patient_id.eq.${patientId},patient_id.is.null`);

      // Get open follow-ups
      const { data: openFollowups } = await supabase
        .from("followup_items")
        .select("description, due_at, priority, status, category")
        .eq("patient_id", patientId)
        .in("status", ["open", "in_progress"])
        .order("due_at", { ascending: true })
        .limit(10);

      if (patient || conclusions?.length || openFollowups?.length) {
        patientContext = `\n\nPATIENT CONTEXT:`;
        if (patient) patientContext += `\nPatient: ${patient.name}`;
        
        if (conclusions?.length) {
          patientContext += `\n\nCURRENT CONCLUSIONS (treat as truth):`;
          conclusions.forEach((c: any) => {
            patientContext += `\n- [${c.conclusion_type}/${c.conclusion_key}] ${JSON.stringify(c.conclusion_value)} (conf: ${c.confidence})`;
          });
        }
        
        if (openFollowups?.length) {
          patientContext += `\n\nOpen Follow-ups:`;
          openFollowups.forEach((f: any, i: number) => {
            const dueDate = new Date(f.due_at).toLocaleDateString();
            const overdue = new Date(f.due_at) < new Date() ? " [OVERDUE]" : "";
            patientContext += `\n${i + 1}. [${f.priority}] ${f.description} (Due: ${dueDate})${overdue}`;
          });
        }
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + patientContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("HealIT chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
