# BUG-B – Availability check mutates booking data: reproduction evidence

## Defect introduced

A deliberate mutation was added inside `checkAvailability()` immediately after the null-room guard:

```ts
room.bookings.push({
  id: 'bug-booking',
  title: 'Temporary Booking',
  start: interval.start,
  end: interval.end,
  bookedBy: 'Bug Test',
});
```

## Expected behavior

Checking room availability must be read-only. It must not add, remove, or modify any entry in `room.bookings`.

## Actual test result

- Test files: 1 failed
- Tests: 7 failed, 14 passed (21 total)
- Duration: 1.14 seconds
- Run start shown in terminal: 22:18:02

## Observed failures

The test output supplied showed failures in:
- AC1 – valid interval acceptance
- AC2 – exactly 120-minute booking acceptance
- AC4 – both endpoint-touching scenarios
- AC5 – available decision with no errors
- AC5 – booking data preservation
- AC5 – no booking added after an available decision

## Root cause

The `room.bookings.push(...)` statement directly mutates the original bookings array. Since the inserted booking uses the same interval being checked, it can also cause the current request to appear to overlap with a booking that the check itself just created.

## Important qualification

BUG-A had not yet been restored when this BUG-B run was performed. Therefore, the two AC4 endpoint-touching failures may be affected by both the earlier overlap-logic defect and the new mutation. The supplied summary confirms 7 failures and 14 passes, but the individual assertion details were not included in the final output.

## Evidence to retain

Keep the full terminal output or a screenshot of this run. The supplied terminal summary showed `7 failed | 14 passed (21)`.
