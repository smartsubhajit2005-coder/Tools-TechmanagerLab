# Tools Suite Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the existing 47 static HTML tools in `site-clean/` by adding shared validation, testing, privacy disclosure, and privacy-first network handling while keeping the site static.

**Architecture:** Keep static HTML pages under `site-clean/`. Add a small shared vanilla JS layer (`site-clean/shared/`) for validation, errors, file handling, downloads, and privacy disclosures. Each tool page loads only the shared modules it needs via `<script type="module">`. Pure calculation/parsing logic is separated from DOM/UI code for unit testing without a browser.

**Tech Stack:** Vanilla JavaScript (ESM), Node.js for unit tests, Playwright for E2E tests, Git for version control.

**Spec:** docs/superpowers/specs/2026-10-31-tools-suite-hardening-mvp-design.md

---

## Global Constraints

- All pricing/figures in INR if referenced (not applicable to this MVP)
- No production uploads without explicit owner approval per upload rule
- Keep static HTML pages under `site-clean/`; no migration to React
- Local processing first. External calls only where unavoidable and always disclosed.
- No unnecessary analytics of user-entered content
- Clear privacy disclosures per tool
- Object URL cleanup and temporary resource release

---

## Review Focus

- Input validation for edge cases (empty, malformed, oversized)
- Password/JWT handling (never logged or transmitted)
- File upload type/size validation
- Network request disclosure and SSRF protection
- Privacy claim verification (actual data flows match published claims)
- Malformed and large input handling
- Object URL lifecycle and cleanup

---

## Task Structure

### Task 1: Inventory and baseline setup

**Files:**
- Create: `site-clean/tools-inventory.json` (name, URL, source, deps, processing model, limitations)
- Create: `site-clean/tests/unit/` (directory for unit tests)
- Create: `site-clean/tests/e2e/` (directory for Playwright E2E tests)

**Interfaces:**
- Consumes: None (initial task)
- Produces: Inventory JSON file, test directories

**Steps:**
- [ ] **Step 1: Inventory all 47 tools** — scan `site-clean/`, extract name, URL (from index), source file, processing model (local vs network), limitations, last verified date.
- [ ] **Step 2: Add unit test harness** — create `site-clean/tests/unit/test-utils.js` with a dummy test that verifies Node environment is ready.
- [ ] **Step 3: Commit** — `git add site-clean/tools-inventory.json site-clean/tests/` && `git commit -m "chore: add inventory and test harness setup"`

### Task 2: Build shared validation and error modules

**Files:**
- Create: `site-clean/shared/validators.js` (input validation helpers)
- Create: `site-clean/shared/errors.js` (error panel renderer)
- Create: `site-clean/shared/file-handling.js` (file type/size validation, object URL lifecycle)
- Create: `site-clean/shared/downloads.js` (download controls)
- Create: `site-clean/shared/privacy.js` (processing disclosure banner)

**Interfaces:**
- Consumes: None (initial task)
- Produces: Shared modules with clear APIs

**Steps:**
- [ ] **Step 1: Write validators.js** — export functions: `isValidInput(input)`, `isValidFile(file)`, `isValidURL(url)` with exact behavior from spec.
- [ ] **Step 2: Write errors.js** — export `createErrorPanel(message)` that returns HTML and announces via ARIA.
- [ ] **Step 4: Write file-handling.js** — export `processFile(file)` that validates, creates object URL, and returns URL or error.
- [ ] **Step 5: Write downloads.js** — export `download(blob, filename)` that creates object URL and triggers download.
- [ ] **Step 5: Write privacy.js** — export `createPrivacyBanner(toolName)` with tool-specific processing disclosure text.
- [ ] **Step 6: Commit** — `git add site-clean/shared/` && `git commit -m "chore: add shared modules"`

### Task 3: Build unit tests for pure calculation modules

**Files:**
- Create: `site-clean/tests/unit/test-utils.js` (dummy test to verify test harness)
- Create: `site-clean/tests/unit/test-validators.js` (test validators.js)
- Create: `site-clean/tests/unit/test-file-handling.js` (test file-handling.js)
- Create: `site-clean/tests/unit/test-privacy.js` (test privacy.js)

**Interfaces:**
- Consumes: `site-clean/shared/validators.js`, `site-clean/shared/file-handling.js`, `site-clean/shared/privacy.js`
- Produces: Passing unit tests for pure functions

**Steps:**
- [ ] **Step 1: Write failing test** — in `test-utils.js`, create `test-utils-fail()` that asserts false to verify test runner.
- [ ] **Step 2: Write passing test** — in `test-validators.js`, create `test-validators-pass()` that imports validators.js and asserts a valid input passes.
- [ ] **Step 3: Write file-handling test** — create `test-file-handling-pass()` that imports file-handling.js and asserts a valid file returns a valid URL.
- [ ] **Step 4: Write privacy test** — create `test-privacy-pass()` that imports privacy.js and asserts banner text is correct.
- [ ] **Step 5: Run all tests** — `npx playwright test tests/unit/` (or node if using simple runner)
- [ ] **Step 6: Commit** — `git add site-clean/tests/unit/` && `git commit -m "chore: add unit tests for shared modules"`

### Task 4: Harden P1 tools (Word Counter, JSON Formatter, IP Subnet Calculator, PDF Word Counter, DOCX Word Counter, PDF Merge, Image Compressor, DNS Lookup, Website Status Checker, Password Strength Checker, JWT Inspector, Income-Tax Calculator)

**Files:**
- Modify existing tool HTML/JS files to import shared modules
- Add privacy banners where processing occurs
- Add input validation using shared validators.js
- Add error handling using shared errors.js

**Interfaces:**
- Consumes: `site-clean/shared/validators.js`, `site-clean/shared/errors.js`, `site-clean/shared/privacy.js`
- Produces: Validated input handling, clear error messages, privacy disclosure

**Status (2026-10-31):** 8 of 12 P1 tools hardened and smoke-tested in Chromium (7/7 pass). Remaining: PDF Word Counter, DOCX Word Count, PDF Merge, Image Compressor.

**Steps:**
- [x] **Step 1: Pick first P1 tool** — start with Word Counter (`word-counter.html`)
- [x] **Step 2: Add privacy banner** — insert `<div id="priv"></div>` after header, rendered via `renderPrivacyBanner()` from `shared/privacy.js`.
- [x] **Step 3: Add input validation** — use validators.js (`isValidText`, `isValidJSON`, `isValidCIDR`, `isValidURL`) to check input before processing.
- [x] **Step 4: Add error handling** — use errors.js (`showError`/`clearMessage`) to show clear messages on invalid input.
- [x] **Step 5: Verify local processing** — confirmed no `fetch()` in local tools; network tools keep their fetch and show the amber network banner.
- [x] **Step 6: Repeat for 7 tools** — JSON Formatter, IP Subnet Calculator, Password Strength, JWT Decoder, Income Tax Calculator, DNS Lookup, Website Status Checker.
- [ ] **Step 7: Repeat for 4 remaining P1 tools** — PDF Word Counter, DOCX Word Count, PDF Merge, Image Compressor (all file-based; need `validateFile` + `file-handling.js`).
- [ ] **Step 8: Commit** — `git add site-clean/` && `git commit -m "feat: harden P1 tools with shared modules and privacy"`
### Task 5: SEO and category page count verification

**Files:**
- Create: `site-clean/categories.json` (accurate category counts)
- Modify category pages (e.g., `document-tools.html`, `developer-tools.html`, etc.) to display accurate counts from `categories.json`

**Interfaces:**
- Consumes: `site-clean/tools-inventory.json`, `categories.json`
- Produces: Accurate category counts displayed on category pages

**Steps:**
- [ ] **Step 1: Create categories.json** — extract accurate counts from inventory (e.g., Document Tools: 5, Developer Tools: 13, etc.)
- [ ] **Step 2: Update category pages** — modify each category’s count display to use `categories.json` data
- [ ] **Step 3: Verify counts match inventory** — diff inventory vs categories.json
- [ ] **Step 4: Commit** — `git add site-clean/categories.json site-clean/category-pages/` && `git commit -m "chore: update category counts from inventory"`

### Task 6: Privacy audit and network verification

**Files:**
- Create: `site-clean/privacy-audit.md` (document findings)
- Create: `site-clean/tests/e2e/privacy-check.js` (Playwright test to verify no sensitive data leaves tab)

**Interfaces:**
- Consumes: site-clean/tools-inventory.json
- Produces: Privacy audit report, E2E test

**Steps:**
- [ ] **Step 1: Document privacy claims** — for each tool, note if processing is local or external, what data is sent, and privacy disclosures.
- [ ] **Step 2: Write privacy-check.js** — create Playwright test that opens each tool, runs a simple input (e.g., type "test"), and verifies no network request contains sensitive data (password, document content, JWT).
- [ ] **Step 3: Document findings** — write privacy-audit.md with summary and tool-by-tool findings.
- [ ] **Step 4: Commit** — `git add site-clean/privacy-audit.md site-clean/tests/e2e/` && `git commit -m "chore: add privacy audit and test"`

### Task 7: E2E tests and measurement

**Files:**
- Create: `site-clean/tests/e2e/main-flow.js` (Playwright test for main tool workflow)
- Create: `site-clean/tests/e2e/measurement.js` (Playwright test to measure load time, memory, and resource cleanup)

**Interfaces:**
- Consumes: All hardened tools
- Produces: Pass/fail results, performance metrics

**Steps:**
- [ ] **Step 1: Write main-flow test** — open a P1 tool (e.g., Word Counter), enter text, verify stats update, download result, return to directory.
- [ ] **Step 2: Write measurement test** — measure load time (first paint), memory usage, and verify object URL cleanup after navigation.
- [ ] **Step 5: Run all E2E tests** — `npx playwright test tests/e2e/`
- [ ] **Step 6: Commit** — `git add site-clean/tests/e2e/` && `git commit -m "chore: add E2E tests and measurement"`

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-31-tools-suite-hardening-mvp.md`. Please review the plan. Which execution approach would you prefer?

- **Subagent-driven** - A fresh subagent implements each task and a fresh reviewer checks it before the next one starts, then a whole-branch review at the end. Most thorough; costs a fresh context per task and per review.
- **Native** - I implement every task myself in this session, the way this harness runs work, then one fresh reviewer on the most capable model checks the whole branch. Cheapest and fastest; no independent review until the end. Runs well with a mid-tier session model, since the plan carries the design.

**For this plan I recommend Native**, because the tasks are tightly coupled to the existing static site structure and the implementation is linear with clear, bite-sized steps. The plan captures what you want, and we should use Native execution.