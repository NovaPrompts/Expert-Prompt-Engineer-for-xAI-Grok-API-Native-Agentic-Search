// Example Deno Edge Function for Supabase
// This shows how to integrate the system prompt with Grok API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const SYSTEM_PROMPT = `[INSERT THE FULL SYSTEM PROMPT FROM ABOVE]`;

interface AnalysisRequest {
  x_handle: string;
  from_date: string; // YYYY-MM-DD
  to_date: string;   // YYYY-MM-DD
}

serve(async (req: Request) => {
  // JWT validation would go here
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { x_handle, from_date, to_date }: AnalysisRequest = await req.json();

    // Validate inputs
    if (!x_handle || !from_date || !to_date) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Grok API with search parameters
    const grokResponse = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("XAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "grok-4-fast-reasoning",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Analyze the X handle: ${x_handle}\nDate range: ${from_date} to ${to_date}`
          }
        ],
        temperature: 0.5,
        max_completion_tokens: 4096, // Grok-4 uses max_completion_tokens
        response_format: { type: "json_object" },
        search_parameters: {
          mode: "auto", // Let Grok decide when to search
          max_search_results: 50, // Fetch up to 50 results per search
          from_date: from_date,
          to_date: to_date,
          return_citations: true,
          sources: [
            {
              type: "x",
              included_x_handles: [x_handle.replace("@", "")], // Remove @ if present
              // Optional: Add engagement filters
              // post_favorite_count: 0,
              // post_view_count: 0
            }
          ]
        }
      })
    });

    if (!grokResponse.ok) {
      const errorData = await grokResponse.text();
      console.error("Grok API Error:", errorData);
      return new Response(
        JSON.stringify({ error: "Grok API request failed", details: errorData }),
        { status: grokResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const grokData = await grokResponse.json();
    
    // Extract JSON response from Grok
    let analysisResult;
    try {
      const contentText = grokData.choices[0].message.content;
      analysisResult = JSON.parse(contentText);
      
      // Add token usage from API response
      if (grokData.usage) {
        analysisResult.token_usage = {
          prompt_tokens: grokData.usage.prompt_tokens || 0,
          completion_tokens: grokData.usage.completion_tokens || 0,
          total_tokens: grokData.usage.total_tokens || 0,
          search_sources_used: grokData.usage.num_sources_used || 0
        };
      }
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse Grok response as JSON",
          raw_response: grokData.choices[0].message.content
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optional: Store in Supabase here
    // await supabaseClient.from('analyses').insert({ ... })

    return new Response(
      JSON.stringify(analysisResult),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* 
 * DEPLOYMENT NOTES:
 * 
 * 1. Set XAI_API_KEY in Supabase Edge Function secrets:
 *    supabase secrets set XAI_API_KEY=your_key_here
 * 
 * 2. For date range calculation, you can add dynamic ranges:
 *    const today = new Date().toISOString().split('T')[0];
 *    const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
 * 
 * 3. For JWT validation:
 *    import { createClient } from '@supabase/supabase-js'
 *    const supabaseClient = createClient(...)
 *    const { data: { user } } = await supabaseClient.auth.getUser(jwt)
 * 
 * 4. Cost estimation per request:
 *    - Grok-4-fast-reasoning: ~$0.20/1M input tokens, ~$1.50/1M output tokens
 *    - Live Search: $0.025 per source (X counts as 1 source)
 *    - Expected cost per analysis: $0.01 - $0.05
 */
