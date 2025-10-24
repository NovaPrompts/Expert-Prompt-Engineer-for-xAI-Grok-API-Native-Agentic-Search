# Expert-Prompt-Engineer-for-xAI-Grok-API-Native-Agentic-Search
View README Master overview with quick start, configuration, and navigation
# Grok API X Handle Analysis - Complete Package
## Production-Ready System Prompt & Implementation

---

## 📦 **PACKAGE CONTENTS**

This package contains everything you need to implement X (Twitter) handle analysis using xAI's Grok-4-fast-reasoning API with native search capabilities.

### Files Included:

| File | Purpose | Use When |
|------|---------|----------|
| **system_prompt.txt** | Raw system prompt text | Copy-paste into your code |
| **grok_api_example.ts** | Complete Deno/Supabase implementation | Reference for integration |
| **quick_start_guide.md** | 10-minute setup guide | Getting started quickly |
| **prompt_documentation.md** | Comprehensive 50+ page docs | Deep dive / troubleshooting |
| **test_suite.ts** | Automated test suite (10 tests) | Validate before production |
| **README.md** | This file | Overview & navigation |

---

## 🚀 **QUICK START (5 MINUTES)**

### 1. Copy the System Prompt
```bash
cat system_prompt.txt
# Copy contents and paste into your code
```

### 2. Set Your API Key
```bash
export XAI_API_KEY="your-api-key-here"
```

### 3. Test with cURL
```bash
# See quick_start_guide.md for complete cURL example
```

### 4. Deploy to Supabase
```bash
# Copy grok_api_example.ts to your functions directory
supabase functions deploy grok-analysis
```

**Done!** Read `quick_start_guide.md` for detailed instructions.

---

## 📋 **SYSTEM PROMPT OVERVIEW**

### What It Does
Analyzes 50-100 recent posts from any X handle and returns:
- **5 Qualitative Metrics** (tone, coherence, engagement, authenticity, focus)
- **Pattern Analysis** (themes, frequency, style, anomalies)
- **Executive Summary** (insights, risks, opportunities)
- **Strict JSON Output** (no parsing errors)

### Key Features
✅ **Temperature 0.5** - Balanced creativity + consistency  
✅ **Native Search** - Uses Grok's built-in X search tools  
✅ **Edge Case Handling** - Graceful zero-post, private account, limited data scenarios  
✅ **Cost Optimized** - ~$0.03 per request  
✅ **Production Ready** - Validated with 10-test suite  

### Configuration
```typescript
{
  model: "grok-4-fast-reasoning",
  temperature: 0.5,
  max_completion_tokens: 4096,
  response_format: { type: "json_object" },
  search_parameters: {
    mode: "auto",
    max_search_results: 50,
    sources: [{ type: "x", included_x_handles: ["target"] }]
  }
}
```

---

## 📊 **JSON OUTPUT SCHEMA**

```json
{
  "analysis_metadata": {
    "handle_analyzed": "string",
    "date_range_start": "YYYY-MM-DD",
    "date_range_end": "YYYY-MM-DD",
    "total_posts_analyzed": 42,
    "analysis_timestamp": "ISO datetime",
    "search_mode_used": "auto"
  },
  "qualitative_metrics": {
    "tone_consistency": { "score": 8, "rationale": "..." },
    "content_coherence": { "score": 7, "rationale": "..." },
    "engagement_quality": { "score": 6, "rationale": "..." },
    "authenticity_signal": { "score": 9, "rationale": "..." },
    "topical_focus": { "score": 8, "rationale": "..." }
  },
  "pattern_analysis": {
    "dominant_themes": ["AI", "Tech News", "Product Launches"],
    "posting_frequency": "Daily bursts",
    "communication_style": "Journalistic",
    "engagement_pattern": "Link-driven",
    "notable_anomalies": null
  },
  "executive_summary": {
    "overview": "...",
    "key_insights": ["...", "...", "..."],
    "risk_factors": ["..."],
    "opportunities": ["..."]
  },
  "token_usage": {
    "prompt_tokens": 2200,
    "completion_tokens": 1800,
    "total_tokens": 4000,
    "search_sources_used": 1
  },
  "status": {
    "success": true,
    "warnings": [],
    "data_quality_note": null
  }
}
```

---

## 🧪 **TESTING**

### Run the Test Suite
```bash
# Install Deno if needed: https://deno.land/
deno test --allow-net --allow-env test_suite.ts
```

### Tests Included:
1. ✅ High-volume account (100+ posts)
2. ✅ Moderate-volume account (30-50 posts)
3. ✅ Recent date range
4. ✅ Old date range (edge case)
5. ✅ JSON schema completeness
6. ✅ Score range validation (1-10)
7. ✅ Consistency across runs
8. ✅ Token usage validation
9. ✅ Executive summary quality
10. ✅ Handle format normalization

**Expected Results**: All 10 tests pass  
**Runtime**: 2-3 minutes  
**Cost**: ~$0.30 for full suite  

---

## 💰 **COST BREAKDOWN**

| Component | Rate | Per Request |
|-----------|------|-------------|
| Input tokens (~2K) | $0.20 / 1M | $0.0004 |
| Output tokens (~2K) | $1.50 / 1M | $0.003 |
| Search (1 X source) | $0.025 / source | $0.025 |
| **Total** | | **~$0.028** |

### Monthly Projections
- **100 requests**: ~$3
- **1,000 requests**: ~$28
- **10,000 requests**: ~$280

---

## 📁 **FILE GUIDE**

### 1. system_prompt.txt
**Size**: ~5KB  
**Purpose**: Raw prompt text for copy-paste  
**Use**: Paste into your API call's system message  

**Example**:
```typescript
const SYSTEM_PROMPT = fs.readFileSync('system_prompt.txt', 'utf8');
```

### 2. grok_api_example.ts
**Size**: ~8KB  
**Purpose**: Complete Deno edge function  
**Use**: Reference implementation for Supabase  

**Features**:
- JWT authentication placeholder
- Error handling
- Token usage tracking
- Supabase integration comments

### 3. quick_start_guide.md
**Size**: ~4KB  
**Purpose**: Get running in 10 minutes  
**Use**: First-time setup  

**Sections**:
- Immediate setup (3 steps)
- Test with cURL
- Validation checklist
- Quick troubleshooting

### 4. prompt_documentation.md
**Size**: ~50KB  
**Purpose**: Deep technical documentation  
**Use**: Understanding design decisions, optimization, troubleshooting  

**Sections**:
- Design rationale (why temp 0.5, why these metrics, etc.)
- API configuration details
- 4-phase testing strategy
- Edge case handling
- Cost optimization
- Common pitfalls
- Advanced customizations

### 5. test_suite.ts
**Size**: ~12KB  
**Purpose**: Automated validation  
**Use**: Pre-production testing  

**Features**:
- 10 distinct test scenarios
- Consistency validation
- Cost tracking
- Schema validation

---

## 🛠️ **IMPLEMENTATION CHECKLIST**

### Phase 1: Setup (Day 1)
- [ ] Get xAI API key from console.x.ai
- [ ] Copy system_prompt.txt into your project
- [ ] Test with cURL using quick_start_guide.md
- [ ] Verify JSON output is valid

### Phase 2: Integration (Days 2-3)
- [ ] Adapt grok_api_example.ts for your stack
- [ ] Add JWT authentication
- [ ] Integrate with Supabase (or your DB)
- [ ] Set up environment variables

### Phase 3: Testing (Days 4-5)
- [ ] Run test_suite.ts
- [ ] Test with your target handles
- [ ] Validate edge cases (private accounts, zero posts)
- [ ] Measure consistency (run same query 3x)

### Phase 4: Optimization (Days 6-7)
- [ ] Monitor token usage
- [ ] Adjust max_search_results if needed
- [ ] Set up cost alerts
- [ ] Cache results for duplicate queries

### Phase 5: Production (Day 8+)
- [ ] Deploy to production
- [ ] Set up monitoring/logging
- [ ] Create dashboard for metrics
- [ ] Iterate based on feedback

---

## ⚙️ **CONFIGURATION OPTIONS**

### Adjust Temperature
```typescript
// More deterministic (for testing)
temperature: 0.3

// Balanced (recommended)
temperature: 0.5

// More creative (may be inconsistent)
temperature: 0.7
```

### Adjust Search Results
```typescript
// Fewer results (faster, cheaper)
max_search_results: 20

// Standard (recommended)
max_search_results: 50

// Note: 50 is the API maximum
```

### Adjust Date Range
```typescript
// Recent activity only
from_date: "2025-10-17" (7 days ago)
to_date: "2025-10-24" (today)

// Longer history
from_date: "2025-09-24" (30 days ago)
to_date: "2025-10-24" (today)

// Don't exceed 180 days (quality degrades)
```

---

## 🚨 **COMMON ISSUES & FIXES**

| Issue | Cause | Solution |
|-------|-------|----------|
| "Model not found" | Wrong model name | Use exact string: `grok-4-fast-reasoning` |
| JSON parse error | Missing response_format | Add: `response_format: { type: "json_object" }` |
| No posts found | @ in handle, or private account | Remove @, verify account is public |
| 401 error | Invalid API key | Check XAI_API_KEY environment variable |
| Timeout (>30s) | Large date range | Reduce to 7-14 days |
| High cost | Too many requests | Implement caching, reduce max_search_results |
| Inconsistent scores | Temperature too high | Lower to 0.3-0.4 |

---

## 🎯 **USE CASES**

### Brand Monitoring
```typescript
// Track your brand's X presence
analyzeHandle("your_brand", last7Days, today);
```

### Competitor Analysis
```typescript
// Compare multiple competitors
Promise.all([
  analyzeHandle("competitor1", last30Days, today),
  analyzeHandle("competitor2", last30Days, today),
  analyzeHandle("competitor3", last30Days, today)
]);
```

### Influencer Vetting
```typescript
// Assess authenticity before partnership
analyzeHandle("potential_influencer", last90Days, today);
// Check authenticity_signal score
```

### Content Strategy
```typescript
// Learn from successful accounts
analyzeHandle("successful_peer", last30Days, today);
// Analyze dominant_themes and posting_frequency
```

---

## 📈 **OPTIMIZATION TIPS**

### 1. Implement Caching
```typescript
// Cache key: handle + date range
const cacheKey = `${handle}:${from_date}:${to_date}`;
const ttl = 86400; // 24 hours

// Check cache first
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// Analyze and cache
const result = await analyzeHandle(...);
await redis.setex(cacheKey, ttl, JSON.stringify(result));
```

### 2. Batch Similar Requests
```typescript
// Instead of 5 separate calls
for (const handle of handles) {
  await analyzeHandle(handle, ...);
}

// Do: Batch in groups
await Promise.all(
  handles.map(h => analyzeHandle(h, ...))
);
```

### 3. Compress System Prompt
- Remove verbose examples (saves ~200 tokens)
- Use abbreviations in instructions (saves ~100 tokens)
- Total savings: ~$0.00006 per request

### 4. Monitor Usage
```typescript
// Track costs in database
await db.insert('api_costs', {
  request_id: id,
  tokens: usage.total_tokens,
  sources: usage.num_sources_used,
  cost: calculateCost(usage),
  timestamp: new Date()
});
```

---

## 🆘 **SUPPORT & RESOURCES**

### Official Documentation
- [xAI API Docs](https://docs.x.ai/)
- [Grok Models](https://docs.x.ai/docs/models)
- [Live Search Guide](https://docs.x.ai/docs/guides/live-search)

### This Package
- Questions? Check `prompt_documentation.md`
- Issues? See "Common Issues" section above
- Customization? See "Advanced Customizations" in docs

### Community
- [xAI Discord](https://x.ai/discord) (hypothetical - check actual xAI site)
- [GitHub Issues](https://github.com/your-repo) (if you publish this)

---

## 🎓 **BEST PRACTICES**

### DO ✅
- Always use `response_format: { type: "json_object" }`
- Remove @ from handles in API calls
- Use `max_completion_tokens` (not `max_tokens`)
- Cache results for 24 hours
- Monitor token usage daily
- Test all edge cases before production

### DON'T ❌
- Don't use date ranges >180 days
- Don't parse JSON without try-catch
- Don't exceed 50 max_search_results
- Don't forget to strip @ from handles
- Don't ignore num_sources_used in billing
- Don't skip the test suite

---

## 🔄 **VERSION HISTORY**

### v1.0 (Current) - October 24, 2025
- Initial release
- Grok-4-fast-reasoning support
- 5 qualitative metrics
- 4 edge case scenarios
- Complete test suite
- Production-ready documentation

### Planned v1.1
- [ ] Sentiment analysis addition
- [ ] Multi-handle comparison mode
- [ ] Image/media analysis
- [ ] Streaming response support

---

## 📝 **FEEDBACK & ITERATION**

### After First Production Week

Measure:
1. **Success rate**: % of requests returning valid JSON
2. **Score consistency**: Variance across duplicate queries
3. **Token usage**: Average per request
4. **Cost**: Total spend vs. budget
5. **Latency**: P95 response time

Optimize based on:
- If success rate <98%: Review error logs
- If scores inconsistent: Lower temperature
- If costs high: Implement caching, reduce search results
- If latency high: Reduce date ranges

---

## 🎉 **YOU'RE READY!**

1. Read `quick_start_guide.md` (10 min)
2. Run `test_suite.ts` (3 min)
3. Deploy to production (30 min)
4. Monitor & iterate (ongoing)

**Total setup time**: Under 1 hour

---

## 📞 **NEXT STEPS**

- **Immediate**: Copy `system_prompt.txt` and test with cURL
- **Today**: Run `test_suite.ts` to validate
- **This week**: Deploy to staging environment
- **Next week**: Production launch with monitoring

Good luck! 🚀

---

**Package Version**: 1.0  
**Last Updated**: October 24, 2025  
**Compatibility**: Grok-4-fast-reasoning, Deno 1.x, Supabase  
**License**: [Your License]  
**Author**: Expert Prompt Engineering for xAI Grok API
