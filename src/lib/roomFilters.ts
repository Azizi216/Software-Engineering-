import type { Room } from '@/data/rooms';

export interface RoomFilters {
  minimumCapacity: number;
  requiredEquipment: string[];
}

export const EQUIPMENT_OPTIONS = [
  'Computers',
  'Lab Equipment',
  'Microphone',
  'Projector',
  'Speakers',
  'Video Conferencing',
  'Whiteboard',
] as const;

/**
 * Returns rooms meeting every active filter.
 * A room must have at least the requested capacity and ALL required equipment.
 * The source catalog is never mutated.
 */
export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  return rooms.filter((room) => {
    const hasCapacity = room.capacity >= filters.minimumCapacity;
    const hasEquipment = filters.requiredEquipment.every((item) =>
      room.equipment.includes(item)
    );
    return hasCapacity && hasEquipment;
  });
}
