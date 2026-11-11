import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import RoomSelector from '@/components/RoomSelector';
import RoomFilters from '@/components/RoomFilters';
import TimeSelector from '@/components/TimeSelector';
import Timeline from '@/components/Timeline';
import ResultPanel from '@/components/ResultPanel';
import { rooms, CURRENT_TIME_MIN } from '@/data/rooms';
import type { Room, Interval } from '@/data/rooms';
import { checkAvailability } from '@/lib/validation';
import { filterRooms, type RoomFilters as RoomFilterValues } from '@/lib/roomFilters';

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [timeSlot, setTimeSlot] = useState<Interval>({ start: 600, end: 660 });
  const [hasChecked, setHasChecked] = useState(false);
  const [filters, setFilters] = useState<RoomFilterValues>({
    minimumCapacity: 0,
    requiredEquipment: [],
  });

  const filteredRooms = useMemo(() => filterRooms(rooms, filters), [filters]);

  const result = useMemo(
    () => checkAvailability(selectedRoom, timeSlot, CURRENT_TIME_MIN),
    [selectedRoom, timeSlot]
  );

  const handleCheck = () => setHasChecked(true);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setHasChecked(false);
  };

  const handleFiltersChange = (nextFilters: RoomFilterValues) => {
    setFilters(nextFilters);
    // Clear the previous selection so a result from a room outside the
    // newly filtered catalog can never remain visible.
    setSelectedRoom(null);
    setHasChecked(false);
  };

  const handleIntervalChange = (newInterval: Interval) => {
    setTimeSlot(newInterval);
    setHasChecked(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: inputs */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              <div className="space-y-5">
                <RoomFilters value={filters} onChange={handleFiltersChange} />
                <RoomSelector
                  rooms={filteredRooms}
                  selectedId={selectedRoom?.id ?? null}
                  onSelect={handleRoomSelect}
                />
                {filteredRooms.length === 0 && (
                  <div role="status" className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                    <p className="font-semibold text-slate-700">No rooms match your filters</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try reducing the attendee count or removing an equipment requirement.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              <TimeSelector interval={timeSlot} onChange={handleIntervalChange} />
            </div>

            {/* Timeline */}
            {selectedRoom && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <Timeline room={selectedRoom} interval={timeSlot} />
              </div>
            )}

            {/* Check button */}
            <button
              onClick={handleCheck}
              disabled={!selectedRoom}
              className={`
                w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-base transition-all
                ${
                  selectedRoom
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-200/50 active:scale-[0.98]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }
              `}
            >
              <Search className="w-5 h-5" />
              Check Availability
            </button>
          </div>

          {/* Right: result */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Result</h2>
                <ResultPanel
                  room={selectedRoom}
                  interval={timeSlot}
                  result={result}
                  hasChecked={hasChecked}
                />
              </div>

              {/* Acceptance criteria legend */}
              <div className="mt-4 p-4 rounded-xl bg-slate-100/70 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">
                  Validation Rules
                </p>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  <li className="flex gap-2">
                    <span className="font-bold text-slate-400 shrink-0">AC1</span>
                    Valid interval: 0 ≤ start &lt; end ≤ 1440, start after current time
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-slate-400 shrink-0">AC2</span>
                    Maximum booking duration: 120 minutes
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-slate-400 shrink-0">AC3</span>
                    Room must not be blocked
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-slate-400 shrink-0">AC4</span>
                    No overlap with existing bookings (touching allowed)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-slate-400 shrink-0">AC5</span>
                    Read-only check — no booking data is modified
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-6xl px-5 sm:px-8 pb-8">
        <p className="text-center text-xs text-slate-400">
          Smart Campus Room Availability Checker — Fictional sample data for demonstration
        </p>
      </footer>
    </div>
  );
}
