# Tech Manager Lab — Tools Technical Architecture Analysis

**Scope:** Recommended architecture and technology choices for the tools directory.  
**Status:** Design analysis, not a verified description of the current implementation.

## 1. Recommended architecture

Use a **client-first architecture with optional, carefully controlled backend services**. Process text, images, and supported documents locally where practical. Use remote services only when a feature genuinely requires them, and disclose the data flow.

```text
Tech Manager Lab
      |
      v
Tools directory and dedicated tool pages
      |
      +-- Documents and PDFs
      +-- Developer utilities
      +-- Network and web diagnostics
      +-- Security utilities
      +-- Image tools
      +-- Finance calculators
      |
      v
Processing layer
      +-- Browser processing (JavaScript / Web APIs / optional WASM)
      +-- Optional controlled backend or external API
      |
      v
Results, preview, and download
```

## 2. Architecture principles

- Local processing first where feasible.
- Independent modules for each tool.
- Shared UI components for file inputs, errors, progress, and downloads.
- Explicit boundaries between browser and server processing.
- Minimal dependencies.
- No unnecessary account requirements.
- Automated tests for calculations, conversions, and file handling.
- Clear and accurate privacy claims.

## 3. Tool-specific architecture

| Tool | Suggested approach | Backend? |
|---|---|---|
| Word Counter | JavaScript text processing | No |
| JSON Formatter | Native JSON parsing/stringifying | No |
| IP Subnet Calculator | Tested JavaScript calculation module | No |
| PDF Word Counter | PDF.js text extraction | No for supported PDFs |
| DOCX Word Counter | Browser-side DOCX text extraction library | No |
| PDF Merge / Split | PDF modification library such as pdf-lib | No for supported files |
| PDF to Images | PDF.js rendering and browser image APIs | No for supported files |
| Image Compressor | Canvas / browser image APIs | No for supported formats |
| DNS Lookup | DNS-over-HTTPS service or controlled backend | Usually external request |
| Website Status Checker | Limited browser test or hardened backend | Depends on desired reliability |
| HTTP Headers Checker | Browser where CORS permits, otherwise controlled backend | Sometimes |
| Income-Tax Calculator | Versioned rule data plus calculation engine | No for ordinary calculations |
| GST / EMI Calculator | Pure calculation functions | No |

These are candidate implementations. Inspect the current code and platform before selecting libraries or changing architecture.

## 4. Candidate technologies

- **JavaScript or TypeScript:** general tool logic.
- **PDF.js:** PDF text extraction and rendering.
- **pdf-lib:** PDF creation and modification.
- **Mammoth.js:** DOCX text-oriented extraction.
- **File API, Blob, object URLs:** local file handling and downloads.
- **Web Workers:** isolate CPU-intensive tasks from the UI thread.
- **Canvas and browser image APIs:** image processing.
- **Unit tests:** calculation and parsing correctness.
- **Browser automation and Lighthouse:** workflow and performance checks.

Official references:
- PDF.js: https://mozilla.github.io/pdf.js/
- pdf-lib: https://pdf-lib.js.org/
- Mammoth.js: https://github.com/mwilliamson/mammoth.js
- Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
- Lighthouse: https://developer.chrome.com/docs/lighthouse/overview/

## 5. Shared component design

Consider shared components for:
- Tool header and description.
- Input validation.
- File selection and file-size display.
- Progress state and cancellation where possible.
- Error messages.
- Output preview.
- Download controls.
- Privacy/processing disclosure.
- Related tools and guides.

Do not force every tool into an identical interface if its workflow differs.

## 6. Suggested project organization

Adapt this to the existing stack; do not assume the site uses a particular framework.

```text
tools/
  index
  registry
  shared/
    validation
    errors
    downloads
    privacy-disclosure
  documents/
    word-counter
    pdf-word-counter
    docx-word-counter
    pdf-merge
    pdf-split
  developer/
    json-formatter
    base64
    url-encoder
    jwt-inspector
  network/
    subnet-calculator
    dns-lookup
    website-status
  images/
    image-compressor
  finance/
    income-tax
    gst
    emi
  tests/
```

The names are conceptual; map them to the actual platform's file and route conventions.

## 7. Performance and reliability

- Avoid loading large libraries on pages that do not need them.
- Lazy-load optional processing libraries.
- Use Web Workers for expensive processing where appropriate.
- Limit file sizes and page counts with understandable messages.
- Release object URLs and temporary resources.
- Process large documents incrementally when possible.
- Show progress for long operations.
- Test on mobile browsers and lower-powered devices.

## 8. Privacy boundaries

For each tool, document:
- What input it accepts.
- Whether input is processed locally.
- Whether a request is sent to an external API.
- Whether any data is stored.
- What analytics can observe.
- What happens on errors.

A tool can perform its main operation locally while still making external requests for DNS, exchange rates, or analytics. Do not describe the entire site as offline if that is not true.

## 9. Implementation sequence

1. Inventory current routes, files, and dependencies.
2. Test existing tools before rewriting them.
3. Extract reusable components only where useful.
4. Stabilize simple client-side tools.
5. Validate document and image processing.
6. Review external network tools and security boundaries.
7. Add automated tests and performance checks.
8. Expand only after reliability is established.

## 10. Conclusion

The recommended direction is a modular, client-first tools hub with a carefully controlled backend only for features that need it. Choose the actual stack after inspecting the current implementation.
