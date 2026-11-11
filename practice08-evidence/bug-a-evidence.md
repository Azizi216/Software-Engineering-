# BUG-A – Incorrect overlap logic: reproduction evidence

## Defect introduced

In `src/lib/validation.ts`, the overlap condition was deliberately changed from:

```ts
if (interval.start < b.end && interval.end > b.start) {
```

to:

```ts
if (interval.start <= b.end && interval.end >= b.start) {
```

## Expected behavior

Bookings that only touch at an endpoint must be allowed. For example, an existing booking from 10:00 to 11:00 and a requested booking from 11:00 to 12:00 do not overlap.

## Actual test result

- Test files: 1 failed
- Tests: 3 failed, 18 passed (21 total)
- Duration: 1.11 seconds
- Run start shown in terminal: 21:54:37

## Failing tests

1. `allows a request whose start equals an existing booking end (touching)`
   - Expected: `result.valid` is `true`
   - Actual: `result.valid` was `false`

2. `allows a request whose end equals an existing booking start (touching)`
   - Expected: `result.valid` is `true`
   - Actual: `result.valid` was `false`

3. `hasOverlap returns the conflicting booking or null`
   - Expected: `hasOverlap({ start: 660, end: 720 }, room)` returns `null`
   - Actual: it returned the existing booking.

## Root cause

Using `<=` and `>=` makes equality at the booking boundaries count as an overlap. The overlap test must use strict comparisons so that endpoint-touching bookings are allowed.

## Evidence to retain

Keep the actual terminal output or a screenshot of the failed Vitest run alongside this file. The output provided for this run showed `3 failed | 18 passed (21)`.
