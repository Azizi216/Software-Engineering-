import { describe, it, expect } from 'vitest';
import {
  isTooLong,
  isRoomBlocked,
  hasOverlap,
  checkAvailability,
} from './validation';
import type { Room, Booking, Interval } from '@/data/rooms';

// ── Fresh fixture factories ─────────────────────────────────────────
// Each test builds its own room so the shared production data is never mutated.

const CT = 540; // 09:00 — same "current time" used by the page

function makeRoom(overrides: Partial<Room> = {}): Room {
  return {
    id: 'test-room',
    name: 'Test Room',
    building: 'Test Building',
    capacity: 50,
    equipment: ['Projector', 'Whiteboard'],
    type: 'Lecture Hall',
    blocked: false,
    bookings: [],
    ...overrides,
  };
}

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: 'test-bk',
    title: 'Test Booking',
    start: 600,
    end: 660,
    bookedBy: 'Tester',
    ...overrides,
  };
}

// ── AC1: valid interval boundaries ──────────────────────────────────

describe('AC1 — interval validation', () => {
  it('accepts a valid interval where start > currentTime', () => {
    const room = makeRoom();
    const interval: Interval = { start: 600, end: 660 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(true);
    expect(result.decision).toBe('available');
    expect(result.errors).toHaveLength(0);
  });

  it('rejects start equal to currentTime (AC1 requires strictly greater)', () => {
    // AC1: "start is after the supplied current time" — strictly greater.
    // Current code uses `start < currentTime`, so start === currentTime passes.
    // This test exposes that discrepancy.
    const room = makeRoom();
    const interval: Interval = { start: CT, end: CT + 30 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('current time'))).toBe(true);
  });

  it('rejects start before currentTime', () => {
    const room = makeRoom();
    const interval: Interval = { start: 480, end: 540 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('current time'))).toBe(true);
  });

  it('rejects start >= end (zero or negative duration)', () => {
    const room = makeRoom();
    const interval: Interval = { start: 600, end: 600 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('earlier than end'))).toBe(true);
  });

  it('rejects end > 1440', () => {
    const room = makeRoom();
    const interval: Interval = { start: 1420, end: 1441 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('day'))).toBe(true);
  });

  it('rejects start < 0', () => {
    const room = makeRoom();
    const interval: Interval = { start: -10, end: 30 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('day'))).toBe(true);
  });
});

// ── AC2: 120-minute duration limit ──────────────────────────────────

describe('AC2 — duration limit', () => {
  it('accepts a booking of exactly 120 minutes', () => {
    const room = makeRoom();
    const interval: Interval = { start: 720, end: 840 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(true);
    expect(result.decision).toBe('available');
  });

  it('rejects a booking of 121 minutes', () => {
    const room = makeRoom();
    const interval: Interval = { start: 720, end: 841 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('120 minutes'))).toBe(true);
  });

  it('isTooLong returns true for 121 min and false for 120 min', () => {
    expect(isTooLong({ start: 0, end: 121 })).toBe(true);
    expect(isTooLong({ start: 0, end: 120 })).toBe(false);
  });
});

// ── AC3: blocked room ───────────────────────────────────────────────

describe('AC3 — blocked room', () => {
  it('rejects a blocked room even with a valid time slot', () => {
    const room = makeRoom({
      blocked: true,
      blockedReason: 'Equipment maintenance scheduled',
    });
    const interval: Interval = { start: 600, end: 660 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('blocked'))).toBe(true);
  });

  it('isRoomBlocked returns true for a blocked room', () => {
    expect(isRoomBlocked(makeRoom({ blocked: true }))).toBe(true);
    expect(isRoomBlocked(makeRoom({ blocked: false }))).toBe(false);
  });
});

// ── AC4: overlap and touching endpoints ─────────────────────────────

describe('AC4 — overlap detection', () => {
  it('rejects a request that overlaps an existing booking', () => {
    const existing = makeBooking({ start: 600, end: 660, title: 'Project Demo' });
    const room = makeRoom({ bookings: [existing] });
    const interval: Interval = { start: 630, end: 690 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('Overlaps'))).toBe(true);
  });

  it('allows a request whose start equals an existing booking end (touching)', () => {
    const existing = makeBooking({ start: 600, end: 660 });
    const room = makeRoom({ bookings: [existing] });
    const interval: Interval = { start: 660, end: 720 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(true);
    expect(result.decision).toBe('available');
  });

  it('allows a request whose end equals an existing booking start (touching)', () => {
    const existing = makeBooking({ start: 660, end: 720 });
    const room = makeRoom({ bookings: [existing] });
    const interval: Interval = { start: 600, end: 660 };
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(true);
    expect(result.decision).toBe('available');
  });

  it('hasOverlap returns the conflicting booking or null', () => {
    const existing = makeBooking({ start: 600, end: 660 });
    const room = makeRoom({ bookings: [existing] });
    expect(hasOverlap({ start: 630, end: 700 }, room)).not.toBeNull();
    expect(hasOverlap({ start: 660, end: 720 }, room)).toBeNull();
  });
});

// ── AC5: decision correctness and booking data preservation ─────────

describe('AC5 — decision and data preservation', () => {
  it('returns "available" with no errors when all rules pass', () => {
    const room = makeRoom({
      bookings: [makeBooking({ start: 600, end: 660 })],
    });
    const interval: Interval = { start: 700, end: 760 };
    const result = checkAvailability(room, interval, CT);
    expect(result.decision).toBe('available');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('returns "unavailable" with errors when a rule fails', () => {
    const room = makeRoom({
      bookings: [makeBooking({ start: 600, end: 660 })],
    });
    const interval: Interval = { start: 610, end: 670 };
    const result = checkAvailability(room, interval, CT);
    expect(result.decision).toBe('unavailable');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('does not modify room bookings after a check', () => {
    const bookingsBefore: Booking[] = [
      makeBooking({ id: 'b-orig', start: 600, end: 660, title: 'Original' }),
    ];
    const room = makeRoom({ bookings: bookingsBefore });
    const interval: Interval = { start: 610, end: 670 };
    checkAvailability(room, interval, CT);
    expect(room.bookings).toEqual(bookingsBefore);
    expect(room.bookings).toHaveLength(1);
    expect(room.bookings[0].id).toBe('b-orig');
    expect(room.bookings[0].title).toBe('Original');
  });

  it('does not add a new booking after an available decision', () => {
    const room = makeRoom({
      bookings: [makeBooking({ start: 600, end: 660 })],
    });
    const interval: Interval = { start: 700, end: 760 };
    checkAvailability(room, interval, CT);
    expect(room.bookings).toHaveLength(1);
  });
});

// ── AC1+AC2: multiple violations reported ───────────────────────────

describe('multiple violations', () => {
  it('reports both AC1 (past start) and AC2 (too long) errors', () => {
    const room = makeRoom();
    const interval: Interval = { start: 480, end: 720 }; // start < CT, duration 240
    const result = checkAvailability(room, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((e) => e.includes('current time'))).toBe(true);
    expect(result.errors.some((e) => e.includes('120 minutes'))).toBe(true);
  });
});

// ── Null room guard ─────────────────────────────────────────────────

describe('null room guard', () => {
  it('returns decision null and an error when no room is selected', () => {
    const interval: Interval = { start: 600, end: 660 };
    const result = checkAvailability(null, interval, CT);
    expect(result.valid).toBe(false);
    expect(result.decision).toBeNull();
    expect(result.errors.some((e) => e.includes('select a room'))).toBe(true);
  });
});
