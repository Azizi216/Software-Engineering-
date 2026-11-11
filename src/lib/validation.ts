import type { Room, Booking, Interval, ValidationResult } from '@/data/rooms';

// AC1: 0 ≤ start < end ≤ 1440 and start > currentTime
export function validateInterval(
  interval: Interval,
  currentTime: number
): { valid: boolean; error?: string } {
  if (interval.start < 0 || interval.end > 1440) {
    return { valid: false, error: 'Times must stay within the day (00:00–24:00).' };
  }
  if (interval.start >= interval.end) {
    return { valid: false, error: 'Start time must be earlier than end time.' };
  }
  if (interval.start <= currentTime) {
    return { valid: false, error: 'Start time must be after the current time.' };
  }
  return { valid: true };
}

// AC2: booking longer than 120 minutes is rejected
export function isTooLong(interval: Interval): boolean {
  return interval.end - interval.start > 120;
}

// AC3: room blocked
export function isRoomBlocked(room: Room): boolean {
  return room.blocked;
}

// AC4: overlap check — touching endpoints allowed (half-open [start, end))
export function hasOverlap(interval: Interval, room: Room): Booking | null {
  for (const b of room.bookings) {
    if (interval.start < b.end && interval.end > b.start) {
      return b;
    }
  }
  return null;
}

// Full validation pipeline — returns all errors + decision
export function checkAvailability(
  room: Room | null,
  interval: Interval,
  currentTime: number
): ValidationResult {
  if (!room) {
    return { valid: false, errors: ['Please select a room.'], decision: null };
  }

  const errors: string[] = [];
  let matchedRule: string | undefined;

  // AC1
  const intervalCheck = validateInterval(interval, currentTime);
  if (!intervalCheck.valid) {
    errors.push(intervalCheck.error!);
    matchedRule = 'AC1';
  }

  // AC2 — always evaluate, independent of AC1
  if (isTooLong(interval)) {
    errors.push('Bookings cannot be longer than 120 minutes.');
    matchedRule = matchedRule ?? 'AC2';
  }

  // AC3
  if (isRoomBlocked(room)) {
    errors.push(room.blockedReason ? `Room is blocked: ${room.blockedReason}` : 'This room is currently blocked.');
    matchedRule = matchedRule ?? 'AC3';
  }

  // AC4 — always evaluate, independent of AC1
  const overlap = hasOverlap(interval, room);
  if (overlap) {
    errors.push(`Overlaps with "${overlap.title}" (${fmt(overlap.start)}–${fmt(overlap.end)}).`);
    matchedRule = matchedRule ?? 'AC4';
  }

  // AC5: decision without modifying booking data
  const decision = errors.length === 0 ? 'available' : 'unavailable';

  return { valid: errors.length === 0, errors, decision, matchedRule };
}

// ── Formatting helpers ─────────────────────────────────────────────

export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
