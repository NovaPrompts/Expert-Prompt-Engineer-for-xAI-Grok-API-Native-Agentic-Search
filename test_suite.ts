// Test Suite for Grok API X Handle Analysis
// Run this to validate prompt performance across different scenarios

import { assertEquals, assertExists } from "https://deno.land/std@0.168.0/testing/asserts.ts";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const API_KEY = Deno.env.get("XAI_API_KEY");

if (!API_KEY) {
  console.error("❌ XAI_API_KEY environment variable not set");
  Deno.exit(1);
}

const SYSTEM_PROMPT = `[PASTE YOUR SYSTEM PROMPT HERE]`;

// Helper function to call Grok API
async function analyzeHandle(handle: string, fromDate: string, toDate: string) {
  const response = await fetch(GROK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-4-fast-reasoning",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze the X handle: ${handle}\nDate range: ${fromDate} to ${toDate}` }
      ],
      temperature: 0.5,
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
      search_parameters: {
        mode: "auto",
        max_search_results: 50,
        from_date: fromDate,
        to_date: toDate,
        return_citations: true,
        sources: [{
          type: "x",
          included_x_handles: [handle.replace("@", "")]
        }]
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return {
    analysis: JSON.parse(data.choices[0].message.content),
    usage: data.usage
  };
}

// Test data - adjust dates as needed
const today = new Date().toISOString().split('T')[0];
const sevenDaysAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];

// =============================================================================
// TEST SUITE
// =============================================================================

console.log("🧪 Starting Grok API Test Suite\n");

// -----------------------------------------------------------------------------
// Test 1: High-Volume Active Account
// -----------------------------------------------------------------------------
Deno.test("Test 1: High-volume active account (verge)", async () => {
  console.log("\n📊 Test 1: Analyzing @verge (high-volume tech news)");
  
  const { analysis, usage } = await analyzeHandle("verge", sevenDaysAgo, today);
  
  // Validate structure
  assertExists(analysis.analysis_metadata, "Missing analysis_metadata");
  assertExists(analysis.qualitative_metrics, "Missing qualitative_metrics");
  assertExists(analysis.pattern_analysis, "Missing pattern_analysis");
  assertExists(analysis.executive_summary, "Missing executive_summary");
  assertExists(analysis.status, "Missing status");
  
  // Validate metrics
  const metrics = analysis.qualitative_metrics;
  for (const [key, metric] of Object.entries(metrics)) {
    assertExists(metric.score, `${key} missing score`);
    assertExists(metric.rationale, `${key} missing rationale`);
    assertEquals(typeof metric.score, "number", `${key} score should be number`);
    assertEquals(metric.score >= 1 && metric.score <= 10, true, `${key} score out of range`);
  }
  
  // Validate post count
  assertEquals(
    analysis.analysis_metadata.total_posts_analyzed > 30,
    true,
    "Should analyze 30+ posts for high-volume account"
  );
  
  // Validate status
  assertEquals(analysis.status.success, true, "Status should be success");
  
  console.log(`✅ Found ${analysis.analysis_metadata.total_posts_analyzed} posts`);
  console.log(`✅ Tone Consistency: ${metrics.tone_consistency.score}/10`);
  console.log(`✅ Token Usage: ${usage.total_tokens} tokens`);
  console.log(`✅ Search Sources: ${usage.num_sources_used}`);
});

// -----------------------------------------------------------------------------
// Test 2: Moderate-Volume Account
// -----------------------------------------------------------------------------
Deno.test("Test 2: Moderate-volume account (NASA)", async () => {
  console.log("\n🚀 Test 2: Analyzing @NASA (moderate volume)");
  
  const { analysis, usage } = await analyzeHandle("NASA", thirtyDaysAgo, today);
  
  // Validate successful analysis
  assertEquals(analysis.status.success, true, "Should successfully analyze");
  
  // Validate reasonable post count
  assertEquals(
    analysis.analysis_metadata.total_posts_analyzed >= 10,
    true,
    "Should find at least 10 posts in 30 days"
  );
  
  // Validate all metrics scored
  const metrics = analysis.qualitative_metrics;
  for (const metric of Object.values(metrics)) {
    assertEquals(metric.score > 0, true, "All metrics should be scored");
  }
  
  // Validate patterns identified
  assertEquals(
    analysis.pattern_analysis.dominant_themes.length >= 1,
    true,
    "Should identify at least 1 theme"
  );
  
  console.log(`✅ Found ${analysis.analysis_metadata.total_posts_analyzed} posts`);
  console.log(`✅ Dominant Themes: ${analysis.pattern_analysis.dominant_themes.join(", ")}`);
  console.log(`✅ Communication Style: ${analysis.pattern_analysis.communication_style}`);
});

// -----------------------------------------------------------------------------
// Test 3: Edge Case - Recent Date Range (Should have posts)
// -----------------------------------------------------------------------------
Deno.test("Test 3: Recent date range", async () => {
  console.log("\n📅 Test 3: Very recent date range (last 2 days)");
  
  const twoDaysAgo = new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0];
  const { analysis } = await analyzeHandle("verge", twoDaysAgo, today);
  
  // Should still find some posts
  assertEquals(
    analysis.analysis_metadata.total_posts_analyzed > 0,
    true,
    "Should find posts in recent 2-day window"
  );
  
  console.log(`✅ Found ${analysis.analysis_metadata.total_posts_analyzed} posts in 2 days`);
});

// -----------------------------------------------------------------------------
// Test 4: Edge Case - Old Date Range (Likely zero or few posts)
// -----------------------------------------------------------------------------
Deno.test("Test 4: Old date range (likely no posts)", async () => {
  console.log("\n🕰️  Test 4: Old date range (2020-01-01 to 2020-01-07)");
  
  const { analysis } = await analyzeHandle("verge", "2020-01-01", "2020-01-07");
  
  // Should handle gracefully even if no posts
  assertEquals(analysis.status.success, true, "Should succeed even with no posts");
  
  if (analysis.analysis_metadata.total_posts_analyzed === 0) {
    // Validate zero-post handling
    assertEquals(
      analysis.qualitative_metrics.tone_consistency.score,
      0,
      "Metrics should be 0 for zero posts"
    );
    assertEquals(
      analysis.status.warnings.length > 0,
      true,
      "Should have warnings for zero posts"
    );
    console.log(`✅ Correctly handled zero posts scenario`);
  } else {
    console.log(`✅ Found ${analysis.analysis_metadata.total_posts_analyzed} old posts`);
  }
});

// -----------------------------------------------------------------------------
// Test 5: JSON Schema Validation
// -----------------------------------------------------------------------------
Deno.test("Test 5: JSON schema completeness", async () => {
  console.log("\n🔍 Test 5: Validating JSON schema completeness");
  
  const { analysis } = await analyzeHandle("verge", sevenDaysAgo, today);
  
  // Required top-level fields
  const requiredFields = [
    "analysis_metadata",
    "qualitative_metrics", 
    "pattern_analysis",
    "executive_summary",
    "token_usage",
    "status"
  ];
  
  for (const field of requiredFields) {
    assertExists(analysis[field], `Missing required field: ${field}`);
  }
  
  // Required metadata fields
  const requiredMetadata = [
    "handle_analyzed",
    "date_range_start",
    "date_range_end",
    "total_posts_analyzed",
    "analysis_timestamp"
  ];
  
  for (const field of requiredMetadata) {
    assertExists(analysis.analysis_metadata[field], `Missing metadata field: ${field}`);
  }
  
  // Required metrics
  const requiredMetrics = [
    "tone_consistency",
    "content_coherence",
    "engagement_quality",
    "authenticity_signal",
    "topical_focus"
  ];
  
  for (const metric of requiredMetrics) {
    assertExists(analysis.qualitative_metrics[metric], `Missing metric: ${metric}`);
    assertExists(analysis.qualitative_metrics[metric].score, `${metric} missing score`);
    assertExists(analysis.qualitative_metrics[metric].rationale, `${metric} missing rationale`);
  }
  
  // Required pattern fields
  assertExists(analysis.pattern_analysis.dominant_themes);
  assertExists(analysis.pattern_analysis.posting_frequency);
  assertExists(analysis.pattern_analysis.communication_style);
  assertExists(analysis.pattern_analysis.engagement_pattern);
  
  // Required summary fields
  assertExists(analysis.executive_summary.overview);
  assertExists(analysis.executive_summary.key_insights);
  
  console.log("✅ All required schema fields present");
});

// -----------------------------------------------------------------------------
// Test 6: Score Range Validation
// -----------------------------------------------------------------------------
Deno.test("Test 6: Score ranges are valid", async () => {
  console.log("\n📊 Test 6: Validating score ranges (1-10)");
  
  const { analysis } = await analyzeHandle("verge", sevenDaysAgo, today);
  
  const metrics = analysis.qualitative_metrics;
  
  for (const [metricName, metric] of Object.entries(metrics)) {
    // Score should be 0 (no data) or 1-10 (valid data)
    const validScore = metric.score === 0 || (metric.score >= 1 && metric.score <= 10);
    assertEquals(validScore, true, `${metricName} score ${metric.score} out of valid range`);
    
    // Rationale should exist and be reasonable length
    assertEquals(typeof metric.rationale, "string", `${metricName} rationale should be string`);
    assertEquals(
      metric.rationale.length >= 10 && metric.rationale.length <= 200,
      true,
      `${metricName} rationale length should be 10-200 chars`
    );
  }
  
  console.log("✅ All scores within valid ranges");
});

// -----------------------------------------------------------------------------
// Test 7: Consistency Test (Run same query twice)
// -----------------------------------------------------------------------------
Deno.test("Test 7: Consistency across multiple runs", async () => {
  console.log("\n🔄 Test 7: Running same analysis twice for consistency");
  
  const handle = "verge";
  const from = sevenDaysAgo;
  const to = today;
  
  const { analysis: run1 } = await analyzeHandle(handle, from, to);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between calls
  const { analysis: run2 } = await analyzeHandle(handle, from, to);
  
  // Compare post counts (should be similar, allowing for new posts)
  const postCountDiff = Math.abs(
    run1.analysis_metadata.total_posts_analyzed - 
    run2.analysis_metadata.total_posts_analyzed
  );
  assertEquals(
    postCountDiff <= 10,
    true,
    "Post counts should be similar across runs"
  );
  
  // Compare scores (should be within 2 points for temperature 0.5)
  const metrics = ["tone_consistency", "content_coherence", "topical_focus"];
  for (const metric of metrics) {
    const score1 = run1.qualitative_metrics[metric].score;
    const score2 = run2.qualitative_metrics[metric].score;
    const scoreDiff = Math.abs(score1 - score2);
    
    if (score1 > 0 && score2 > 0) { // Only compare if both have data
      assertEquals(
        scoreDiff <= 2,
        true,
        `${metric} scores should be within 2 points (got ${score1} vs ${score2})`
      );
    }
  }
  
  console.log(`✅ Run 1: ${run1.analysis_metadata.total_posts_analyzed} posts`);
  console.log(`✅ Run 2: ${run2.analysis_metadata.total_posts_analyzed} posts`);
  console.log("✅ Consistency check passed");
});

// -----------------------------------------------------------------------------
// Test 8: Token Usage Validation
// -----------------------------------------------------------------------------
Deno.test("Test 8: Token usage is reasonable", async () => {
  console.log("\n💰 Test 8: Validating token usage");
  
  const { analysis, usage } = await analyzeHandle("verge", sevenDaysAgo, today);
  
  // Validate token counts exist
  assertExists(usage.prompt_tokens, "Missing prompt_tokens");
  assertExists(usage.completion_tokens, "Missing completion_tokens");
  assertExists(usage.total_tokens, "Missing total_tokens");
  
  // Validate reasonable ranges
  assertEquals(
    usage.prompt_tokens >= 1000 && usage.prompt_tokens <= 5000,
    true,
    "Prompt tokens should be 1000-5000"
  );
  
  assertEquals(
    usage.completion_tokens >= 500 && usage.completion_tokens <= 4096,
    true,
    "Completion tokens should be 500-4096"
  );
  
  // Calculate cost
  const inputCost = (usage.prompt_tokens / 1000000) * 0.20;
  const outputCost = (usage.completion_tokens / 1000000) * 1.50;
  const searchCost = (usage.num_sources_used || 1) * 0.025;
  const totalCost = inputCost + outputCost + searchCost;
  
  console.log(`✅ Prompt tokens: ${usage.prompt_tokens}`);
  console.log(`✅ Completion tokens: ${usage.completion_tokens}`);
  console.log(`✅ Search sources: ${usage.num_sources_used || 1}`);
  console.log(`✅ Estimated cost: $${totalCost.toFixed(4)}`);
  
  assertEquals(
    totalCost <= 0.10,
    true,
    "Cost per request should be under $0.10"
  );
});

// -----------------------------------------------------------------------------
// Test 9: Executive Summary Quality
// -----------------------------------------------------------------------------
Deno.test("Test 9: Executive summary has substance", async () => {
  console.log("\n📝 Test 9: Validating executive summary quality");
  
  const { analysis } = await analyzeHandle("verge", sevenDaysAgo, today);
  
  const summary = analysis.executive_summary;
  
  // Overview should be substantive
  assertEquals(
    summary.overview.length >= 100,
    true,
    "Overview should be at least 100 chars"
  );
  
  // Should have insights
  assertEquals(
    summary.key_insights.length >= 2,
    true,
    "Should have at least 2 key insights"
  );
  
  // Each insight should be meaningful
  for (const insight of summary.key_insights) {
    assertEquals(
      insight.length >= 20,
      true,
      "Each insight should be at least 20 chars"
    );
  }
  
  console.log(`✅ Overview: ${summary.overview.substring(0, 100)}...`);
  console.log(`✅ ${summary.key_insights.length} key insights identified`);
});

// -----------------------------------------------------------------------------
// Test 10: Handle Format Validation
// -----------------------------------------------------------------------------
Deno.test("Test 10: Handle with @ symbol is stripped", async () => {
  console.log("\n🔤 Test 10: Testing handle format normalization");
  
  // Test with @ symbol (should be stripped internally)
  const { analysis: withAt } = await analyzeHandle("@verge", sevenDaysAgo, today);
  
  // Handle in metadata should not have @
  assertEquals(
    withAt.analysis_metadata.handle_analyzed.includes("@"),
    false,
    "Handle should not include @ symbol in metadata"
  );
  
  console.log(`✅ Handle normalized to: ${withAt.analysis_metadata.handle_analyzed}`);
});

// =============================================================================
// RUN ALL TESTS
// =============================================================================

console.log("\n" + "=".repeat(60));
console.log("🎉 TEST SUITE COMPLETE");
console.log("=".repeat(60));
console.log("\nIf all tests passed, your system prompt is production-ready!");
console.log("\n📊 Next steps:");
console.log("1. Test with your specific target handles");
console.log("2. Monitor token usage in production");
console.log("3. Iterate on prompt based on real feedback");
console.log("4. Set up cost alerts at $100/month threshold");

/*
 * USAGE:
 * 
 * Basic run:
 *   deno test --allow-net --allow-env test_suite.ts
 * 
 * Run specific test:
 *   deno test --allow-net --allow-env --filter "Test 1" test_suite.ts
 * 
 * Verbose output:
 *   deno test --allow-net --allow-env test_suite.ts -- --verbose
 * 
 * COST ESTIMATE FOR FULL SUITE:
 * - 10 tests × ~$0.03 per request = ~$0.30 total
 * 
 * EXPECTED RUNTIME:
 * - ~2-3 minutes (depends on API latency)
 * 
 * TROUBLESHOOTING:
 * - If tests timeout: Increase date ranges or use more active handles
 * - If consistency test fails: Lower temperature to 0.3
 * - If token usage high: Compress system prompt
 */
