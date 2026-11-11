import { MapPin, Users, Lock, CheckCircle2 } from 'lucide-react';
import type { Room } from '@/data/rooms';

interface RoomSelectorProps {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (room: Room) => void;
}

const typeColors: Record<Room['type'], string> = {
  'Lecture Hall': 'bg-accent-100 text-accent-700 border-accent-200',
  Lab: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  'Seminar Room': 'bg-primary-100 text-primary-700 border-primary-200',
  Auditorium: 'bg-success-100 text-success-700 border-success-200',
};

export default function RoomSelector({ rooms, selectedId, onSelect }: RoomSelectorProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Select a Room</h2>
        <span className="text-xs font-medium text-slate-400">{rooms.length} rooms</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rooms.map((room) => {
          const selected = room.id === selectedId;
          return (
            <button
              key={room.id}
              onClick={() => onSelect(room)}
              className={`
                relative text-left p-4 rounded-xl border-2 transition-all duration-200
                ${
                  selected
                    ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-200/50 scale-[1.01]'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }
              `}
            >
              {selected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500" />
                </div>
              )}

              <div className="flex items-start justify-between pr-7">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{room.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {room.building}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center flex-wrap gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeColors[room.type]}`}
                >
                  {room.type}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {room.capacity} seats
                </span>
                {room.blocked && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-error-100 text-error-700 border-error-200">
                    <Lock className="w-3 h-3" />
                    Blocked
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Room equipment">
                {room.equipment.map((item) => (
                  <span key={item} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                    {item}
                  </span>
                ))}
              </div>

              {!room.blocked && room.bookings.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  {room.bookings.length} existing booking{room.bookings.length > 1 ? 's' : ''} today
                </p>
              )}
              {!room.blocked && room.bookings.length === 0 && (
                <p className="mt-2 text-xs text-success-500 font-medium">Fully open today</p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
