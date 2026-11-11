import { ChevronDown } from 'lucide-react';
import { fmt, fmtDuration } from '@/lib/validation';
import { CURRENT_TIME_MIN } from '@/data/rooms';
import type { Interval } from '@/data/rooms';
import { useState } from 'react';

interface TimeSelectorProps {
  interval: Interval;
  onChange: (interval: Interval) => void;
}

// Generate time options in 15-minute increments
const SLOTS: number[] = (() => {
  const slots: number[] = [];
  for (let m = 0; m <= 1440; m += 15) slots.push(m);
  return slots;
})();

export default function TimeSelector({ interval, onChange }: TimeSelectorProps) {
  const [focused, setFocused] = useState<'start' | 'end' | null>(null);
  const duration = Math.max(0, interval.end - interval.start);

  const startOptions = SLOTS.filter((s) => s < 1440);
  const endOptions = SLOTS.filter((e) => e > 0);

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Choose Your Time Slot</h2>

      {/* Duration badge */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 border border-slate-200">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200">
          <span className="text-sm font-bold text-primary-600 tabular-nums">{duration}</span>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Duration</p>
          <p className="text-sm font-bold text-slate-700">
            {duration > 0 ? fmtDuration(duration) : '—'}
            {duration > 120 && <span className="text-error-600 ml-2">exceeds 120 min limit</span>}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Start time */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">Start Time</label>
          <div className="relative">
            <select
              value={interval.start}
              onFocus={() => setFocused('start')}
              onBlur={() => setFocused(null)}
              onChange={(e) => {
                const start = Number(e.target.value);
                onChange({ ...interval, start, end: Math.max(start + 15, interval.end) });
              }}
              className={`
                w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 font-semibold tabular-nums transition-all cursor-pointer
                ${
                  focused === 'start'
                    ? 'border-primary-400 ring-2 ring-primary-100'
                    : 'border-slate-200 hover:border-slate-300'
                }
                bg-white text-slate-800
              `}
            >
              {startOptions.map((m) => (
                <option key={m} value={m} disabled={m < CURRENT_TIME_MIN}>
                  {fmt(m)}
                  {m < CURRENT_TIME_MIN ? ' (past)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* End time */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">End Time</label>
          <div className="relative">
            <select
              value={interval.end}
              onFocus={() => setFocused('end')}
              onBlur={() => setFocused(null)}
              onChange={(e) => onChange({ ...interval, end: Number(e.target.value) })}
              className={`
                w-full appearance-none px-4 py-3 pr-10 rounded-xl border-2 font-semibold tabular-nums transition-all cursor-pointer
                ${
                  focused === 'end'
                    ? 'border-primary-400 ring-2 ring-primary-100'
                    : 'border-slate-200 hover:border-slate-300'
                }
                bg-white text-slate-800
              `}
            >
              {endOptions.map((m) => (
                <option key={m} value={m} disabled={m <= interval.start}>
                  {fmt(m)}
                  {m <= interval.start ? ' (invalid)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '30 min', dur: 30 },
            { label: '60 min', dur: 60 },
            { label: '90 min', dur: 90 },
            { label: '120 min', dur: 120 },
          ].map((p) => (
            <button
              key={p.dur}
              onClick={() => {
                const start = Math.max(interval.start, CURRENT_TIME_MIN);
                onChange({ start, end: Math.min(1440, start + p.dur) });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
