import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing reminders...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get due reminders that are still queued
    const { data: dueReminders, error: fetchError } = await supabase
      .from("reminders")
      .select(`
        id,
        followup_item_id,
        organization_id,
        channel,
        recipient_email,
        scheduled_at,
        message_content,
        followup_items (
          id,
          description,
          due_at,
          priority,
          status,
          patients (
            id,
            name,
            email
          )
        )
      `)
      .eq("status", "queued")
      .lte("scheduled_at", new Date().toISOString())
      .limit(50);

    if (fetchError) {
      console.error("Error fetching reminders:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${dueReminders?.length || 0} due reminders`);

    const results = {
      processed: 0,
      emailsSent: 0,
      inAppCreated: 0,
      errors: [] as string[],
    };

    for (const reminder of dueReminders || []) {
      try {
        const followupItem = reminder.followup_items as any;
        const patient = followupItem?.patients;

        // Skip if followup is already done
        if (followupItem?.status === "done" || followupItem?.status === "dismissed") {
          await supabase
            .from("reminders")
            .update({ status: "canceled" })
            .eq("id", reminder.id);
          continue;
        }

        if (reminder.channel === "email") {
          const recipientEmail = reminder.recipient_email || patient?.email;
          
          if (recipientEmail) {
            // Call send-reminder-email function
            const { error: emailError } = await supabase.functions.invoke("send-reminder-email", {
              body: {
                to: recipientEmail,
                patientName: patient?.name || "Patient",
                followupDescription: followupItem?.description || "Follow-up reminder",
                dueAt: followupItem?.due_at,
                priority: followupItem?.priority,
              },
            });

            if (emailError) {
              console.error("Email send error:", emailError);
              await supabase
                .from("reminders")
                .update({ 
                  status: "failed", 
                  error_message: emailError.message,
                  sent_at: new Date().toISOString()
                })
                .eq("id", reminder.id);
              results.errors.push(`Email failed for reminder ${reminder.id}`);
            } else {
              await supabase
                .from("reminders")
                .update({ status: "sent", sent_at: new Date().toISOString() })
                .eq("id", reminder.id);
              results.emailsSent++;
            }
          } else {
            // No email available, mark as failed
            await supabase
              .from("reminders")
              .update({ 
                status: "failed", 
                error_message: "No recipient email available",
                sent_at: new Date().toISOString()
              })
              .eq("id", reminder.id);
          }
        } else if (reminder.channel === "in_app") {
          // For in-app, just mark as delivered (UI will show pending items)
          await supabase
            .from("reminders")
            .update({ status: "delivered", sent_at: new Date().toISOString() })
            .eq("id", reminder.id);
          results.inAppCreated++;
        }

        results.processed++;
      } catch (err) {
        console.error(`Error processing reminder ${reminder.id}:`, err);
        results.errors.push(`Reminder ${reminder.id}: ${err}`);
      }
    }

    // Process escalations
    const { data: dueEscalations, error: escError } = await supabase
      .from("escalations")
      .select(`
        id,
        followup_item_id,
        organization_id,
        level,
        target_role,
        followup_items (
          id,
          status,
          description,
          patients (name)
        )
      `)
      .eq("status", "pending")
      .lte("trigger_at", new Date().toISOString())
      .limit(50);

    if (escError) {
      console.error("Error fetching escalations:", escError);
    } else {
      console.log(`Found ${dueEscalations?.length || 0} due escalations`);

      for (const escalation of dueEscalations || []) {
        const followupItem = escalation.followup_items as any;

        // Skip if followup is already done
        if (followupItem?.status === "done" || followupItem?.status === "dismissed") {
          await supabase
            .from("escalations")
            .update({ status: "resolved", resolved_at: new Date().toISOString() })
            .eq("id", escalation.id);
          continue;
        }

        // Mark escalation as triggered
        await supabase
          .from("escalations")
          .update({ status: "triggered", triggered_at: new Date().toISOString() })
          .eq("id", escalation.id);

        // Log to audit
        await supabase.from("audit_log").insert({
          organization_id: escalation.organization_id,
          action: "escalate",
          entity_type: "followup_item",
          entity_id: escalation.followup_item_id,
          metadata: {
            escalation_level: escalation.level,
            target_role: escalation.target_role,
          },
        });
      }
    }

    console.log("Process complete:", results);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Process reminders error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
