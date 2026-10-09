# License Reconciliation Checklist (Quarterly, 20 Minutes)

For teams of 20–200 seats on Microsoft 365 or Google Workspace. Under 15 seats: do it by hand. Run first Monday of each quarter.

## 1. Export users (5 min)
- [ ] M365 Admin Center → Users → Active Users → Export → save as `users-export.csv`
- [ ] OR Google Admin Console → Users → Download users → save as `users-export.csv`
- [ ] Columns needed: DisplayName, Email, LicenseStatus, LastSignIn
- [ ] Template: `users-export-template.xlsx` in this folder

## 2. Export bills (5 min)
- [ ] Zoho Books → Purchases → Bills → filter vendor Microsoft / Google → Export
- [ ] Record each invoice: Vendor, InvoiceNo, Period, Seats, RateINR, AmountINR
- [ ] Template: `invoices-template.xlsx` in this folder

## 3. Match (5 min)
- [ ] Open both CSVs in Excel → Data → Get Data → From Text/CSV
- [ ] Power Query → Merge Queries on Email
- [ ] Flag: LastSignIn older than 90 days + LicenseStatus active = Ghost Candidate
- [ ] Sanity check: total billed seats vs active users — the gap is your leak

## 4. Approve + suspend (5 min + waiting)
- [ ] Log every Ghost Candidate in `ghost-review-log.xlsx`
- [ ] Email each department head: "These accounts show no sign-in for 90 days. Approve suspension by Friday."
- [ ] Suspend approved accounts in Admin Center — NEVER delete on day one
- [ ] No automated revocation without a human sign-off, ever

## 5. Calendarise (once)
- [ ] Recurring event: first Monday of each quarter, 30 minutes blocked
- [ ] Attach this checklist + the Power Query workbook
- [ ] File the review log as access-review evidence (SOC 2 / NIS2)

## Boundaries
- Under 15 seats: manual review, skip the method
- Contractor churn problem: fix onboarding automation, not reconciliation
- Shared/mailbox accounts: exclude before flagging

Ghost seats found this quarter: ______ | Monthly saving: ₹______ | Annual saving: ₹______
