# Tech Manager Lab — Network and Web Tools Technical Analysis

**Scope:** IP Subnet Calculator, DNS Lookup, Website Status Checker, HTTP Headers Checker, and Security Headers Checker.  
**Status:** Design and risk analysis; current implementations have not been inspected.

## 1. Summary

Network tools are a strong differentiator for Tech Manager Lab. Some are fully client-side calculations; others require external services or a carefully secured backend.

## 2. IP Subnet Calculator

**Backend:** Not required.

Inputs: IPv4 address and CIDR prefix or subnet mask.

Outputs may include network address, subnet mask, broadcast address, usable range, total address count, and usable host count where applicable.

Example: `192.168.1.10/24` belongs to network `192.168.1.0/24`, with broadcast address `192.168.1.255`.

Test `/0`, `/24`, `/30`, `/31`, `/32`, invalid octets, invalid prefixes, and boundary addresses. Handle `/31` and `/32` explicitly rather than blindly applying traditional usable-host formulas. Treat IPv6 as a separate feature.

## 3. DNS Lookup

**Backend:** Not necessarily; a public DNS-over-HTTPS endpoint may be used.

Possible records: A, AAAA, MX, TXT, CNAME, NS, and SOA.

Workflow:
1. Validate hostname.
2. Query the configured DNS-over-HTTPS endpoint.
3. Parse the response.
4. Display record type, value, TTL, and errors where available.

Test nonexistent domains, timeouts, empty responses, multiple records, internationalized names, malformed responses, and rate limits.

**Privacy:** The entered domain is sent to the selected DNS service. Disclose this external request instead of describing the lookup as offline.

Reference: https://developers.google.com/speed/public-dns/docs/doh/overview

## 4. Website Status Checker

A browser-side request may fail because of cross-origin restrictions even when the destination is operational. A failed browser request is not proof that the website is down.

Possible outcomes:
- Response received.
- HTTP error response.
- Timeout.
- DNS failure.
- Connection failure.
- Inconclusive result.

A backend can provide more reliable checks, but accepting arbitrary URLs creates server-side request forgery (SSRF) risks.

A production backend must restrict loopback, private, link-local, and cloud metadata addresses; disallowed protocols; redirect destinations; DNS resolution and rebinding scenarios; internal hostnames; request duration; and response size.

Do not expose internal systems through a public URL checker.

## 5. HTTP Headers Checker

Cross-origin header inspection is limited by CORS. A controlled backend may be needed for reliable checks across arbitrary public sites.

Potential checks:
- HTTP status and redirect behavior.
- Cache-related headers.
- Content type.
- Content-Security-Policy.
- Strict-Transport-Security.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.

Explain the purpose of each header. The presence of a header does not automatically mean its configuration is secure.

## 6. Security Headers Checker

Distinguish:
- Missing header.
- Malformed header.
- Present but weak configuration.
- Configuration that requires context to assess.

Do not present one numeric score as a complete security assessment. Explain findings and limitations.

## 7. Recommended architecture

| Tool | Architecture |
|---|---|
| IP Subnet Calculator | Client-side pure calculation module |
| DNS Lookup | Browser request to a disclosed DNS-over-HTTPS provider, or controlled backend |
| Website Status Checker | Limited browser test or hardened backend |
| HTTP Headers Checker | Browser where permitted; otherwise controlled backend |
| Security Headers Checker | Same controlled request model as headers checker |

## 8. Test plan

- Correct and incorrect hostnames.
- Redirect loops and excessive redirects.
- Timeouts and rate limits.
- CORS-denied targets.
- Invalid URLs and disallowed protocols.
- Private and internal IP destinations for any backend.
- DNS changes and unusual DNS answers.
- Malformed response headers.
- Clear distinction between an error and an inconclusive result.

## 9. Priority

1. Validate IP Subnet Calculator arithmetic.
2. Audit Website Status Checker behavior and SSRF boundaries if a backend is used.
3. Document the DNS provider and its data handling.
4. Validate HTTP and Security Headers Checker conclusions.

## 10. Conclusion

Keep subnet calculations local. For network diagnostics that query external systems, explain the service boundary, report uncertainty honestly, and apply strict backend protections where applicable.
