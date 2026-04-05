// Supabase Edge Function: send-reminder-email
// Sends HTML emails via Google Workspace SMTP using noreply@willowpa.com
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, htmlBody } = await req.json();

    if (!to || !subject || !htmlBody) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, htmlBody" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Google Workspace SMTP credentials from environment
    const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const SMTP_USER = Deno.env.get("SMTP_USER") || "noreply@willowpa.com";
    const SMTP_PASS = Deno.env.get("SMTP_PASS") || "";
    const FROM_NAME = Deno.env.get("FROM_NAME") || "Willow Property Manager";

    const client = new SmtpClient();

    await client.connectTLS({
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      username: SMTP_USER,
      password: SMTP_PASS,
    });

    // Wrap body in full HTML email template
    const fullHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:24px;">
    <div style="background:#7d5228;padding:16px 24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:600;">Willow</h1>
      <p style="margin:2px 0 0;color:#d4b896;font-size:11px;">Property Manager</p>
    </div>
    <div style="background:#fff;padding:24px;border:1px solid #ddd8ce;border-top:none;border-radius:0 0 12px 12px;">
      ${htmlBody}
    </div>
    <div style="text-align:center;padding:16px;font-size:10px;color:#9e9485;">
      <p style="margin:0;">Sent by Willow Property Manager</p>
      <p style="margin:4px 0 0;">noreply@willowpa.com</p>
    </div>
  </div>
</body>
</html>`;

    await client.send({
      from: `${FROM_NAME} <${SMTP_USER}>`,
      to,
      subject,
      content: "Please view this email in an HTML-capable email client.",
      html: fullHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: `Email sent to ${to}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
