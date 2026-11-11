import { fmt } from '@/lib/validation';
import { CURRENT_TIME_MIN } from '@/data/rooms';
import type { Room, Interval } from '@/data/rooms';

interface TimelineProps {
  room: Room | null;
  interval: Interval;
}

const HOURS = Array.from({ length: 25 }, (_, i) => i * 60); // 0, 60, 120, ... 1440

export default function Timeline({ room, interval }: TimelineProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide">
        Today&apos;s Schedule
      </h3>

      {/* Timeline track */}
      <div className="relative h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
        {/* Hour gridlines */}
        {HOURS.map((m) => (
          <div
            key={m}
            className="absolute top-0 bottom-0 w-px bg-slate-200"
            style={{ left: `${(m / 1440) * 100}%` }}
          />
        ))}

        {/* Current time marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-secondary-500 z-20"
          style={{ left: `${(CURRENT_TIME_MIN / 1440) * 100}%` }}
        >
          <div className="absolute -top-0 -translate-x-1/2 left-1/2 w-2 h-2 rounded-full bg-secondary-500" />
        </div>

        {/* Existing bookings */}
        {room &&
          !room.blocked &&
          room.bookings.map((b) => (
            <div
              key={b.id}
              className="absolute top-2 bottom-2 rounded-md bg-slate-300 border border-slate-400 px-1.5 flex items-center overflow-hidden group hover:bg-slate-400 transition-colors z-10"
              style={{
                left: `${(b.start / 1440) * 100}%`,
                width: `${((b.end - b.start) / 1440) * 100}%`,
              }}
              title={`${b.title} (${fmt(b.start)}–${fmt(b.end)})`}
            >
              <span className="text-[10px] font-semibold text-slate-700 truncate whitespace-nowrap">
                {b.title}
              </span>
            </div>
          ))}

        {/* Candidate interval */}
        {room && interval.end > interval.start && (
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 h-12 rounded-md border-2 z-15 transition-all
              ${
                interval.start >= CURRENT_TIME_MIN
                  ? 'bg-primary-400/40 border-primary-500'
                  : 'bg-error-400/30 border-error-500'
              }
            `}
            style={{
              left: `${(interval.start / 1440) * 100}%`,
              width: `${((interval.end - interval.start) / 1440) * 100}%`,
            }}
          >
            <span className="absolute -top-5 left-0 text-[10px] font-bold text-primary-600 whitespace-nowrap">
              {fmt(interval.start)}–{fmt(interval.end)}
            </span>
          </div>
        )}
      </div>

      {/* Time axis labels */}
      <div className="relative h-4 text-[10px] text-slate-400 font-medium">
        {[0, 4, 8, 12, 16, 20, 24].map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2 tabular-nums"
            style={{ left: `${(h * 60 / 1440) * 100}%` }}
          >
            {fmt(h * 60)}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-300 border border-slate-400" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-primary-500 bg-primary-400/40" /> Your slot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-secondary-500" /> Current time
        </span>
      </div>
    </div>
  );
}
