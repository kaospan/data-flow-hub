import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a medical follow-up assistant for HealIT. Your role is to help clinical staff manage patient follow-ups, NOT to provide medical advice or diagnoses.

WHAT YOU DO:
- Help identify action items from patient conversations (referrals, lab follow-ups, appointments needed)
- Create structured follow-up tasks with due dates
- Track what needs to happen next
- Alert about potentially "dropped balls" (things that haven't been scheduled or followed up)

WHAT YOU DON'T DO:
- You NEVER diagnose or provide medical advice
- You NEVER interpret lab results or clinical findings
- You NEVER suggest treatments or medications
- For emergencies, you ALWAYS say: "This sounds urgent. Please contact emergency services or go to the nearest emergency room."

RESPONSE FORMAT:
When you identify action items, respond with a structured JSON in your response that can be parsed:

If you identify follow-ups needed, include:
\`\`\`json
{
  "followups": [
    {
      "category": "schedule_appointment" | "review_result" | "repeat_test" | "medication_check" | "admin_other",
      "description": "Clear description of what needs to be done",
      "due_in_days": 7,
      "priority": "low" | "medium" | "high",
      "owner_role": "patient" | "staff" | "clinician"
    }
  ],
  "questions": ["Any clarifying questions if information is missing"]
}
\`\`\`

If the message doesn't require follow-ups, respond conversationally but always be helpful in tracking what needs to happen.

LANGUAGE:
- Respond in the same language the user writes in (Hebrew or English)
- For Hebrew, use natural medical terminology used in Israeli clinics

Remember: You are a follow-up tracker, not a doctor. Your job is to ensure things don't slip through the cracks.`;

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

      // Get open follow-ups
      const { data: openFollowups } = await supabase
        .from("followup_items")
        .select("description, due_at, priority, status, category")
        .eq("patient_id", patientId)
        .in("status", ["open", "in_progress"])
        .order("due_at", { ascending: true })
        .limit(10);

      // Get recent events
      const { data: recentEvents } = await supabase
        .from("events")
        .select("type, occurred_at, payload_json")
        .eq("patient_id", patientId)
        .order("occurred_at", { ascending: false })
        .limit(5);

      if (patient || openFollowups?.length || recentEvents?.length) {
        patientContext = `\n\nCURRENT PATIENT CONTEXT:`;
        if (patient) {
          patientContext += `\nPatient: ${patient.name}`;
        }
        if (openFollowups?.length) {
          patientContext += `\n\nOpen Follow-ups:`;
          openFollowups.forEach((f: any, i: number) => {
            const dueDate = new Date(f.due_at).toLocaleDateString();
            patientContext += `\n${i + 1}. [${f.priority}] ${f.description} (Due: ${dueDate}, Status: ${f.status})`;
          });
        }
        if (recentEvents?.length) {
          patientContext += `\n\nRecent Events:`;
          recentEvents.forEach((e: any, i: number) => {
            const eventDate = new Date(e.occurred_at).toLocaleDateString();
            patientContext += `\n${i + 1}. ${e.type} on ${eventDate}`;
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
