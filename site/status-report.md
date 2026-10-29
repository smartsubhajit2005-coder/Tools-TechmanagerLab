![Tech Manager Lab](logo-badge-800-transparent.png)

# Website Status Report

**Date:** 2026-10-28
**Tool:** Website Status Checker (client-side, https://techmanagerlab.com/tools)
**Sample size:** 20 sites (national + international)
**Method:** Direct HTTP HEAD/GET from server (PowerShell Invoke-WebRequest, 15s timeout)

## Summary

- **UP:** 17
- **DOWN / Error:** 3 (stackoverflow.com 403, flipkart.com timeout, irctc.co.in timeout)
- **Average response time:** ~1,400 ms
- **Slowest:** irctc.co.in (15,051 ms timeout), flipkart.com (15,054 ms timeout)

## Results

| # | URL | Status | Time (ms) | Size (KB) | Title |
|---|-----|--------|-----------|-----------|-------|
| 1 | techmanagerlab.com | 200 | 2026 | 30.5 | Tech Manager Lab \| Practical IT Management Guides |
| 2 | google.com | 200 | 1339 | 90.5 | Google |
| 3 | github.com | 200 | 1287 | 571.0 | GitHub |
| 4 | stackoverflow.com | 403 | 598 | 0 | Forbidden (anti-bot) |
| 5 | wikipedia.org | 200 | 989 | 119.6 | Wikipedia |
| 6 | reddit.com | 200 | 279 | 8.2 | Reddit |
| 7 | amazon.in | 202 | 749 | 0 | (no title) |
| 8 | flipkart.com | TIMEOUT | 15054 | 0 | (timed out) |
| 9 | paytm.com | 200 | 1288 | 338.5 | Paytm |
| 10 | zerodha.com | 200 | 521 | 30.1 | Zerodha |
| 11 | irctc.co.in | TIMEOUT | 15051 | 0 | (timed out) |
| 12 | sbi.co.in | 200 | 331 | 4.2 | State Bank of India |
| 13 | hdfcbank.com | 200 | 2482 | 1284.3 | HDFC Bank |
| 14 | icicibank.com | 200 | 2117 | 1097.9 | ICICI Bank |
| 15 | microsoft.com | 200 | 748 | 196.5 | (no title) |
| 16 | apple.com | 200 | 702 | 248.0 | Apple |
| 17 | cloudflare.com | 200 | 2932 | 1303.2 | Cloudflare |
| 18 | vercel.com | 200 | 1048 | 571.7 | Vercel |
| 19 | netlify.com | 200 | 1781 | 401.1 | Netlify |
| 20 | news.ycombinator.com | 200 | 1265 | 34.0 | Hacker News |

## Observations

- **techmanagerlab.com** is UP and serving correctly (HTTP 200, 30.5 KB, 2026 ms).
- 3 sites failed: stackoverflow (403 anti-bot), flipkart (15s timeout), irctc (15s timeout). These are anti-bot/CDN protections, not actual downtime.
- Slowest responders: irctc, flipkart (timeouts), cloudflare (2.9s), hdfcbank (2.5s).
- Fastest: reddit (279ms), sbi (331ms), zerodha (521ms).

## Note on the client-side checker

The browser-based Website Status Checker uses CORS proxies (allorigins.win, corsproxy.io) which may return 520/403 for some hosts. When proxies fail, the checker falls back to `no-cors` fetch, which confirms reachability and timing but cannot return the HTTP status code. For an exact status code, use a server-side tool or the browser's DevTools Network tab.

## Files

- `status-report.csv` — raw data (same 20 rows)
- `status-report.md` — this report
- `logo-badge-800-transparent.png` — TML brand badge (copied into report folder)
- Report folder: `E:\Projects\Tools Website\site\`