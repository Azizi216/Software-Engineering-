import { describe, expect, it } from 'vitest';
import type { Room } from '@/data/rooms';
import { filterRooms } from './roomFilters';
import { checkAvailability } from './validation';

const catalog: Room[] = [
  {
    id: 'small',
    name: 'Small Seminar',
    building: 'A',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    type: 'Seminar Room',
    blocked: false,
    bookings: [],
  },
  {
    id: 'large',
    name: 'Large Lecture',
    building: 'B',
    capacity: 100,
    equipment: ['Projector', 'Whiteboard', 'Microphone'],
    type: 'Lecture Hall',
    blocked: false,
    bookings: [{ id: 'booking-large', title: 'Lecture', start: 600, end: 660, bookedBy: 'Staff' }],
  },
  {
    id: 'lab',
    name: 'Computer Lab',
    building: 'C',
    capacity: 30,
    equipment: ['Computers', 'Projector'],
    type: 'Lab',
    blocked: true,
    bookings: [],
  },
];

describe('room filtering — F1 and F2', () => {
  it('returns every room when no filters are selected', () => {
    expect(filterRooms(catalog, { minimumCapacity: 0, requiredEquipment: [] })).toHaveLength(3);
  });

  it('includes a room whose capacity exactly equals the requested attendees', () => {
    const result = filterRooms(catalog, { minimumCapacity: 20, requiredEquipment: [] });
    expect(result.map((room) => room.id)).toContain('small');
  });

  it('excludes rooms with insufficient capacity', () => {
    const result = filterRooms(catalog, { minimumCapacity: 31, requiredEquipment: [] });
    expect(result.map((room) => room.id)).not.toContain('small');
    expect(result.map((room) => room.id)).not.toContain('lab');
  });

  it('requires ALL selected equipment items', () => {
    const result = filterRooms(catalog, {
      minimumCapacity: 0,
      requiredEquipment: ['Projector', 'Microphone'],
    });
    expect(result.map((room) => room.id)).toEqual(['large']);
  });

  it('returns an empty list when no room satisfies the requirements', () => {
    expect(
      filterRooms(catalog, {
        minimumCapacity: 500,
        requiredEquipment: ['Projector'],
      })
    ).toEqual([]);
  });

  it('does not mutate the original room catalog', () => {
    const before = [...catalog];
    filterRooms(catalog, { minimumCapacity: 40, requiredEquipment: ['Projector'] });
    expect(catalog).toEqual(before);
  });
});

describe('room selection and availability integration — F3 and F5', () => {
  it('checks availability against the selected room booking data', () => {
    const selectedRoom = filterRooms(catalog, {
      minimumCapacity: 80,
      requiredEquipment: ['Microphone'],
    })[0];

    const result = checkAvailability(selectedRoom, { start: 630, end: 690 }, 540);
    expect(selectedRoom.id).toBe('large');
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((error) => error.includes('Lecture'))).toBe(true);
  });

  it('never reports a blocked selected room as available', () => {
    const selectedRoom = catalog.find((room) => room.id === 'lab')!;
    const result = checkAvailability(selectedRoom, { start: 600, end: 660 }, 540);
    expect(result.decision).toBe('unavailable');
    expect(result.errors.some((error) => error.toLowerCase().includes('blocked'))).toBe(true);
  });

  it('refreshes the decision when a different room with different bookings is selected', () => {
    const openRoom = catalog.find((room) => room.id === 'small')!;
    const bookedRoom = catalog.find((room) => room.id === 'large')!;
    const requested = { start: 630, end: 690 };

    const firstResult = checkAvailability(openRoom, requested, 540);
    const secondResult = checkAvailability(bookedRoom, requested, 540);

    expect(firstResult.decision).toBe('available');
    expect(secondResult.decision).toBe('unavailable');
    expect(secondResult.errors.some((error) => error.includes('Lecture'))).toBe(true);
  });
});
