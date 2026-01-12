import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderEmailRequest {
  to: string;
  patientName: string;
  followupDescription: string;
  dueAt: string;
  priority: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { to, patientName, followupDescription, dueAt, priority }: ReminderEmailRequest = await req.json();

    console.log(`Sending reminder email to ${to} for patient ${patientName}`);

    const priorityColors: Record<string, string> = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#22c55e",
    };

    const priorityLabels: Record<string, string> = {
      high: "High Priority",
      medium: "Medium Priority",
      low: "Low Priority",
    };

    const dueDate = new Date(dueAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 24px; }
            .logo { font-size: 28px; font-weight: bold; color: #0d9488; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; background-color: ${priorityColors[priority] || priorityColors.medium}; }
            .content { margin: 24px 0; }
            .patient-name { font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 8px; }
            .description { font-size: 16px; color: #475569; margin-bottom: 16px; }
            .due-date { font-size: 14px; color: #64748b; padding: 12px; background: #f1f5f9; border-radius: 8px; }
            .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <div class="logo">🏥 HealIT</div>
                <p style="color: #64748b; margin-top: 8px;">Follow-up Reminder</p>
              </div>
              
              <div style="text-align: center; margin-bottom: 20px;">
                <span class="priority">${priorityLabels[priority] || "Medium Priority"}</span>
              </div>
              
              <div class="content">
                <div class="patient-name">${patientName}</div>
                <div class="description">${followupDescription}</div>
                <div class="due-date">
                  <strong>Due:</strong> ${dueDate}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated reminder from HealIT.</p>
              <p>Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "HealIT <onboarding@resend.dev>",
        to: [to],
        subject: `Follow-up Reminder: ${patientName} - ${followupDescription}`,
        html: htmlContent,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Send reminder email error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
