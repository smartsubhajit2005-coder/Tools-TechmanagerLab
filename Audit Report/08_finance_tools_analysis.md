# Tech Manager Lab — Indian Finance Tools Technical Analysis

**Scope:** Income-tax calculator, GST calculator, and EMI calculator.  
**Status:** Technical design and validation plan; current calculation code and rule data have not been verified.

## 1. Overview

Finance calculators can attract useful traffic, but their credibility depends on correct formulas, current rules, explicit assumptions, and clear limitations. The calculations can usually run in the browser; that does not remove the need to maintain and verify the underlying rules.

## 2. Income-Tax Calculator

**Complexity:** High. Backend is not required for ordinary calculations.

Separate the UI from a versioned calculation engine and financial-year rule data.

Potential factors, depending on applicable rules:
- Financial year and tax regime.
- Supported income categories.
- Eligible deductions.
- Rebates and eligibility conditions.
- Surcharge and cess where applicable.
- Rounding rules.

Do not merely change the displayed year. Verify every applicable rule against authoritative government sources and test calculations before release.

The previous audit noted that the tool was labelled FY 2025–26 while the audit date was 28 October 2026. Review whether a current-year calculator is needed, while retaining historical calculations only if clearly labelled.

## 3. GST Calculator

Separate arithmetic from the rate-selection interface.

For an inclusive price:

`Taxable value = inclusive price / (1 + rate)`

`GST amount = inclusive price - taxable value`

For an exclusive price:

`GST amount = taxable value × rate`

The rate is represented as a decimal in the formulas. Clearly distinguish inclusive and exclusive inputs. Do not imply that a short list of rates covers every good or service; rate applicability depends on the relevant classification and rules.

## 4. EMI Calculator

For a standard amortizing loan with a fixed monthly interest rate:

`EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)`

Where:
- `P` is principal.
- `r` is monthly interest rate as a decimal.
- `n` is the number of monthly payments.

Handle zero interest separately to avoid division by zero.

Recommended outputs:
- Monthly EMI.
- Principal.
- Total interest.
- Total repayment.
- Repayment schedule.
- Assumed interest method.

Explain that lender results can differ due to fees, rate changes, payment dates, and rounding.

## 5. Testing plan

### Income tax
- Test each supported regime and financial year.
- Test thresholds and boundary values.
- Test eligible and ineligible deductions.
- Verify rebates, surcharge, cess, and rounding where applicable.
- Compare with independently verified examples.

### GST
- Inclusive and exclusive inputs.
- Zero and invalid values.
- Decimal rounding.
- Different rates.
- Correct labels and assumptions.

### EMI
- Zero-interest case.
- Very low and high rates.
- Short and long tenures.
- Zero or invalid principal.
- Compare against independently calculated examples.
- Validate repayment schedule totals.

## 6. User-facing safeguards

- Display the applicable financial year and last-reviewed date.
- State assumptions and supported scenarios.
- Explain that outputs are estimates.
- Do not present calculations as professional tax or financial advice.
- Provide an appropriate contact or correction route.

## 7. Recommended priority

1. Verify the current income-tax calculator's financial-year label and rule data.
2. Independently test EMI arithmetic and edge cases.
3. Verify GST rate descriptions and input assumptions.
4. Add clear explanations, examples, and review dates.

## 8. Conclusion

The finance tools should be treated as rule-driven software, not just small arithmetic widgets. Correct rule data and repeatable tests are essential before promoting them.
