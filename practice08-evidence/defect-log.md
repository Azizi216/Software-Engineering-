# Smart Campus – Practice 08 Defect Log

## Project baseline

- Project: Smart Campus Room Availability
- Baseline backup: Saved separately by the student
- Test file: `src/lib/validation.test.ts`
- Test execution: Completed successfully
- Test files: 1 passed
- Tests: 21 passed, 0 failed
- Duration: 1.48 seconds

## Baseline test evidence

The existing test suite passed all 21 tests. The tests cover:

- AC1 – Interval validation
- AC2 – Maximum booking duration
- AC3 – Blocked room validation
- AC4 – Booking overlap detection and endpoint-touching cases
- AC5 – Availability decision and booking-data preservation
- Multiple validation violations
- Null room handling

## Defect log

| Test ID | Input / scenario | Expected output | Actual output | Suspected cause |
|---|---|---|---|---|
| BASE-01 | Run the existing 21 tests in `src/lib/validation.test.ts` | All existing tests pass | 21 passed, 0 failed | No failure was detected in the current implementation during this baseline run. |

## Notes

- No defect in the current working implementation has been confirmed by this baseline test run.
- BUG-A (incorrect endpoint overlap handling) and BUG-B (booking data mutation) are controlled defects required by Practice 08. They have not yet been reproduced or tested in this log.
- Do not record a controlled defect as reproduced until its failing test has actually been run and the output has been saved.

## Evidence to attach

- Screenshot or copied terminal output showing `Test Files 1 passed` and `Tests 21 passed`.
- Keep the original project backup unchanged for comparison.
