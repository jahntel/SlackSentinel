import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json()

    // Slack URL verification challenge
    if (body.type === "url_verification") {
      return new Response(JSON.stringify({ challenge: body.challenge }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Handle Slack event
    if (body.event) {
      const event = body.event

      // Skip bot messages and message edits
      if (event.bot_id || event.subtype || event.hidden) {
        return new Response(JSON.stringify({ status: "ignored" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // Extract message data
      const messageData = {
        type: event.type,
        user: event.user,
        text: event.text,
        channel: event.channel,
        ts: event.ts,
        channel_type: body.authorizations?.[0]?.user_id ? "channel" : "im",
      }

      // Forward to classification service
      const classifyResponse = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/classify-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify(messageData),
        }
      )

      const classification = await classifyResponse.json()

      return new Response(
        JSON.stringify({ status: "processed", classification }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    return new Response(JSON.stringify({ status: "unknown_event" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
