# Tech Manager Lab — Tools Suite Hardening MVP Spec

**Project:** techmanagerlab.com/tools  
**Spec date:** 31 October 2026  
**Scope:** Harden the existing 47 static HTML tools. No new tools.  
**Status:** Written for review

## 1. Intent and constraints

Intent: Make the existing tools suite dependable, private-by-default, testable, and crawlable before any new tools are added.

Constraints:
- Keep static HTML pages under `site-clean/`; do not migrate to React.
- Do not add new tools.
- Local processing first. External calls only where unavoidable and always disclosed.
- No production uploads without explicit owner approval per upload rule.
- All pricing/figures in INR if any are referenced (not applicable to this MVP).

## 2. Architecture

```
tools/
  index.html
  <category>-tools.html   (one per category)
  <tool-name>.html        (one per tool)
  shared/
    validators.js         shared input validation
    errors.js             shared error panel renderer
    file-handling.js      file type/size validation, object URL lifecycle
    downloads.js          shared download controls
    privacy.js            per-tool processing disclosure banner
    network.js            fetch with timeout, abort, SSRF-guard for backend calls
```

- Each tool page loads only the shared modules it needs via `<script type="module">`.
- Pure calculation/parsing logic is separated from DOM/UI code so it can be unit-tested without a browser.
- Category pages list tools with accurate counts and short descriptions; tool cards include a "runs locally" label where verified.

## 3. Module boundaries

| Module | Responsibility | Browser | Testable standalone |
|---|---|---|---|
| validators.js | required fields, type/size, URL scheme allowlist | yes | yes |
| errors.js | error panel markup + announce | yes | partial (DOM) |
| file-handling.js | File input, MIME sniff via extension + magic bytes where possible, object URL create/revoke | yes | partial |
| downloads.js | Blob/object-URL download, filename sanitization | yes | partial |
| privacy.js | processing-disclosure banner text per tool | yes | yes |
| network.js | timeout + abort controller + SSRF guard + no credential forwarding | yes | yes (with fetch mock) |

## 4. Processing model

Local-first tools (no external request): word counter, case converter, text diff, JSON formatter, Base64, URL encode/decode, UUID, regex tester, color converter, cron parser, JWT decoder, password strength/generator, image tools, PDF tools, calculators (income tax/GST/EMI), unit/currency/timezone converters, QR generator/decoder, carbon footprint, redirect generator, cron parser.

External-call tools (disclosed): DNS lookup (DNS-over-HTTPS endpoint), website status checker (browser fetch with inconclusive results, no arbitrary proxy), HTTP/security headers checker (browser where CORS permits, otherwise no claim). Exchange-rate-driven currency converter calls a disclosed rate API.

Privacy claims must match verified network behavior. No sensitive input (passwords, JWTs, document contents) is logged, transmitted, or sent to analytics.

## 5. Shared components

- Tool header + description
- Input validation with inline errors
- File picker + size display
- Progress/cancellation where feasible
- Error panel
- Output preview + copy
- Download control
- Privacy/processing disclosure
- Related tools + guide links

Not every tool uses an identical interface; shared components are opt-in.

## 6. Security boundaries

- Passwords/JWTs: local only, never logged or transmitted.
- File uploads: type and size validated; corrupt/malformed handled with clear errors; object URLs released.
- Website status checker: browser-side only; never proxies arbitrary server-side URLs; reports "inconclusive" instead of false down/up.
- DNS lookup: discloses the DoH provider.
- Currency converter: discloses the rate API and that rates are indicative.

## 7. Testing levels

Level 1 unit tests (Node): IP subnet arithmetic, word counts, GST/EMI formulas, JSON parsing, validation, file-range calculations.

Level 2 integration tests (Playwright): select file → process → download; extract DOCX/PDF text; submit malformed input → clear error.

Level 3 browser E2E (Playwright): open tool → enter input → run → verify output → download → return to directory; mobile viewport.

Acceptance criteria per tool: functionality, accuracy against verified values, error handling, privacy matches claim, no avoidable UI freeze, accessible labels + keyboard, mobile works, crawlable metadata.

## 8. Rollout phases

Phase 1 — Inventory and baseline: inventory every tool (name, URL, source, deps, processing model, limitations); test primary functions; record broken links/errors; inspect data flows for sensitive tools.

Phase 2 — Stabilize priority tools: fix verified defects; add unit tests for calculations; improve validation/errors; verify downloads.

Phase 3 — Shared components + SEO/accessibility: extract shared modules; review metadata/canonical/structured data; test mobile; add descriptions/limitations.

Phase 4 — Measurement and follow-up: privacy-aligned events only; review failures/completion; expand only where justified.

## 9. Prioritization (per audit)

P1: Word Counter, JSON Formatter, IP Subnet Calculator, PDF Word Counter, DOCX Word Counter, PDF Merge, Image Compressor, DNS Lookup, Website Status Checker, Password Strength Checker, JWT Inspector, Income-Tax Calculator.

P2: PDF Split, PDF Compression, HTTP/Security Headers Checker, PDF to Images, GST Calculator, EMI Calculator.

P3: PDF-to-Word conversion (deferred until reliable implementation feasible).

## 10. Open decisions

- Whether to keep `site-clean/` as the canonical source or sync to live via WP file manager.
- The exact DNS-over-HTTPS provider for DNS Lookup (disclose once chosen).
- Whether currency converter uses a rate API or static indicative rates.

---

Spec written to `docs/superpowers/specs/2026-10-31-tools-suite-hardening-mvp-design.md`. Please review it and let me know if you want changes before we move to the implementation plan (writing-plans skill).
