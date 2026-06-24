import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

const CRITICAL_PATTERNS = [
  /prod(uction)?\s*(is\s*)?(down|crash(ed)?|fail(ing|ed))/i,
  /outage/i,
  /database\s*(down|crash|fail|erro)/i,
  /500\s*error/i,
  /server\s*(down|unresponsive)/i,
  /security\s*(breach|incident|vulnerability)/i,
]

const HIGH_PATTERNS = [
  /need\s*(your|some)?\s*(help|review|eyes)/i,
  /blocking\s*(me|you|team)/i,
  /deadline/i,
  /client\s*(call|meeting|review)/i,
  /asap/i,
]

const LOW_PATTERNS = [
  /donuts?\s*(in|at)/i,
  /lunch/i,
  /meme/i,
  /funny/i,
  /happy\s*(birthday|monday|friday)/i,
]

function classifyText(text: string): { priority: string; reason: string; confidence: number } {
  const lowerText = text.toLowerCase()

  for (const pattern of CRITICAL_PATTERNS) {
    if (pattern.test(lowerText)) {
      return { priority: "critical", reason: "Critical system/production issue detected", confidence: 0.92 }
    }
  }

  for (const pattern of HIGH_PATTERNS) {
    if (pattern.test(lowerText)) {
      return { priority: "high", reason: "Work-related priority message", confidence: 0.85 }
    }
  }

  for (const pattern of LOW_PATTERNS) {
    if (pattern.test(lowerText)) {
      return { priority: "low", reason: "Social/casual message", confidence: 0.78 }
    }
  }

  return { priority: "normal", reason: "General message", confidence: 0.6 }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json()

    const text = body.text || ""
    const slackTs = body.ts
    const channelId = body.channel
    const senderId = body.user
    const isDM = body.channel_type === "im"

    // Classify the message
    const classification = classifyText(text)

    // Store in Supabase if we have the required data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (supabaseUrl && supabaseKey && senderId) {
      const supabase = createClient(supabaseUrl, supabaseKey)

      // Try to get or create user
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("slack_user_id", senderId)
        .single()

      let userId = existingUser?.id

      if (!userId) {
        const { data: newUser } = await supabase
          .from("users")
          .insert({
            slack_user_id: senderId,
            display_name: `User ${senderId}`,
          })
          .select("id")
          .single()
        userId = newUser?.id
      }

      if (userId) {
        // Check for active focus session
        const { data: activeSession } = await supabase
          .from("focus_sessions")
          .select("id")
          .eq("user_id", userId)
          .eq("is_active", true)
          .single()

        // Store the message
        await supabase.from("messages").insert({
          user_id: userId,
          focus_session_id: activeSession?.id || null,
          slack_message_ts: slackTs,
          slack_channel_id: channelId,
          sender_slack_id: senderId,
          sender_name: `User ${senderId}`,
          message_text: text,
          is_dm: isDM,
          priority: classification.priority,
          classification_reason: classification.reason,
          classification_confidence: classification.confidence,
        })
      }
    }

    return new Response(
      JSON.stringify({
        status: "classified",
        ...classification,
        is_dm: isDM,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
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
