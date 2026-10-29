# Tech Manager Lab — Security and Privacy Technical Audit Plan

**Scope:** Browser-processing claims, passwords, JWTs, uploaded files, external APIs, storage, dependencies, and web security controls.  
**Status:** Test plan and recommendations; no confirmed implementation defects are asserted.

## 1. Why this matters

The Tools Hub claims that processing occurs in the browser and that data does not leave the tab. Such statements are valuable only if they accurately describe every relevant tool and dependency.

A tool can process its main input locally while still making external requests for DNS, exchange rates, analytics, or other features.

## 2. Data-flow verification

For each tool, document:
- Input types.
- Where processing occurs.
- Outbound requests.
- Third-party dependencies.
- Browser storage use.
- Server logs, if any.
- Error-handling behavior.
- Data-retention behavior.

## 3. Practical test matrix

| Test | Expected result if local processing is claimed |
|---|---|
| Process a text document | No document content sent to a server |
| Compress an image | No image upload |
| Merge PDFs | No PDF upload |
| Use password checker | Password not transmitted or logged |
| Decode JWT | Token not transmitted or logged |
| Format JSON or URL | Input not sent to unrelated services |
| Run DNS lookup | External DNS request disclosed |
| Run website status check | External request and processing model explained |
| Inspect browser storage | No unexpected sensitive data retained |
| Inspect network requests | No unexpected upload or content transmission |

These are tests to perform, not reported failures.

## 4. Password and token handling

### Password Strength Checker
- Evaluate locally.
- Never log or transmit the password.
- Do not include it in analytics events.
- Avoid browser storage.
- Clear input when appropriate.
- Do not claim a strength score guarantees security.

### JWT Inspector
- Explain that decoding does not verify authenticity.
- Do not transmit tokens or include them in logs.
- Handle malformed tokens safely.
- Label unverified claims clearly.

## 5. File-handling safeguards

- Validate file type and size.
- Do not trust file extensions alone.
- Handle corrupt and malformed files.
- Avoid unnecessary permissions.
- Release object URLs and temporary resources.
- Provide clear errors.
- Do not silently upload a file as a fallback if local processing was promised.
- Test large files for memory exhaustion and UI freezes.

## 6. External dependencies

Review third-party JavaScript libraries, CDNs, external APIs, analytics scripts, dependency versions, maintenance status, integrity controls where applicable, and unexpected network requests.

A local-processing tool may still load third-party code, so dependency trust and data flow should be reviewed separately.

## 7. Website security controls to verify

- HTTPS and canonical redirects.
- Content Security Policy, where compatible with the platform.
- Appropriate clickjacking protections.
- MIME-sniffing protections.
- Safe file handling and download names.
- Secure handling of user-supplied URLs.
- Dependency maintenance.
- Input validation and error handling.

This report does not assert that any of these controls are currently missing.

## 8. Privacy policy checklist

Explain whether input is processed locally, which tools call external services, whether analytics collect usage data, whether files or outputs are retained, what browser storage is used, and how visitors can report privacy concerns.

Keep claims specific. Prefer a per-tool processing disclosure when behavior differs across the directory.

## 9. Recommended priority

1. Inspect network requests for password, JWT, document, and image tools.
2. Verify the browser-only promise.
3. Review dependencies and external APIs.
4. Test malformed and large inputs.
5. Review server-side URL-checking controls, if applicable.
6. Update privacy disclosures to match observed behavior.

## 10. Conclusion

Privacy must be verified through source inspection and network testing, not inferred from the interface. Make no stronger privacy claim than the implementation supports.
