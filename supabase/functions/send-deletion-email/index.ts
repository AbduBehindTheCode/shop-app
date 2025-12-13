import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  userEmail: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userEmail } = (await req.json()) as RequestBody;

    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "User email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF5252; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .footer { text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Account Deletion Request</h2>
            </div>
            <div class="content">
              <p><strong>User Email:</strong> ${userEmail}</p>
              <p><strong>Request Time:</strong> ${new Date().toISOString()}</p>
              <p><strong>Status:</strong> Pending Review</p>
              <hr>
              <p>A user has requested account deletion. Please review and process this request according to your data retention policies.</p>
              <p>The deletion should be completed within 48 hours.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from Shoppy</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "shoppy.dot.plus@gmail.com",
        subject: `Account Deletion Request - ${userEmail}`,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend API error:", error);
      throw new Error(error.message || `Resend API error: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Email sent successfully to shoppy.dot.plus@gmail.com for user: ${userEmail}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account deletion request email sent",
        userEmail,
        emailId: result.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
