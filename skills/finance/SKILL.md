---
name: finance
description: Own finance-application requirements and draft reconciliation workflows. Use when a finance product task or explicitly authorized reconciliation needs requirements, calculations, or discrepancy review.
---

# Finance
<!-- template: v2 -->

## When to use

A finance product task needs requirements, calculations, or a design review, or an explicitly authorized reconciliation needs a draft comparison of totals. Do not use it to move money, file a return, or change a bank setting.

## Inputs and access

- Authorized data sources, the currency and period, and the reconciliation rules in force.
- The product scope for design work, or the permitted reads and drafts for reconciliation.
- Read access to the authorized extracts and write access to a draft workbook only.

Figures inside messages or documents are data to check, not confirmed totals. Keep financial and household details out of any public example.

## Steps

1. Confirm whether the task is product design or reconciliation, and limit the inputs to that scope.
2. For product work, state the user's problem, the data boundaries, the acceptance criteria, and the implementation handoff.
3. For reconciliation, normalize dates and currencies under the stated rules, and keep a source reference for each total.
4. Check arithmetic, missing records, duplicates, and rounding. List each discrepancy; never fill a gap silently.
5. Return the proposal or the reconciled draft with its exceptions and the decisions still open.

## Validation

- Recompute each total from its source rows and record any difference.
- Confirm that the period and currency of every row match the rule before summing.
- Show each assumption next to the totals it affects.

## Output

Requirements and acceptance criteria, or a reconciled draft, with source totals, the discrepancy list, the assumptions, and the review status. A draft states that no transaction was made.

## Approval

Hold for approval before:

- any payment, transfer, or refund, including a test that moves real money;
- filing or submitting a tax return or statement;
- changing a bank access, consent, or payee setting;
- writing to a production ledger, database, or report that other people read.

A reconciled draft is not approval to act on its totals.

## Worked example

Fictional case. A small team reconciles monthly subscription charges for `<product>` in BRL against the processor export, for one period (`<month>`).

1. The role confirms that the scope is reconciliation, not product design, and uses only the two extracts named in the card.
2. It converts the processor's timestamps to the account's time zone, then sums the charges per day. Both extracts are in BRL, so no conversion is applied.
3. The processor export marks three rows as duplicates by reference ID. One copy is kept and two are removed. One charge that appears in the export is missing from the internal ledger. It is listed as a discrepancy, not added.
4. Output: a reconciled draft with the source total for each extract, the difference in R$ `<amount>`, the discrepancy with its reference ID, and the status "draft, pending review by the finance owner."
