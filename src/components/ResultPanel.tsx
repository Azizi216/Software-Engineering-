import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { fmt, fmtDuration } from '@/lib/validation';
import type { ValidationResult } from '@/data/rooms';
import type { Room, Interval } from '@/data/rooms';

interface ResultPanelProps {
  room: Room | null;
  interval: Interval;
  result: ValidationResult;
  hasChecked: boolean;
}

export default function ResultPanel({ room, interval, result, hasChecked }: ResultPanelProps) {
  if (!hasChecked) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
          <Clock className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-medium text-slate-400">
          Select a room and time slot to check availability
        </p>
      </div>
    );
  }

  const available = result.decision === 'available';
  const duration = interval.end - interval.start;

  return (
    <div
      className={`
        animate-slide-up rounded-2xl border-2 p-6 transition-all
        ${available ? 'border-success-200 bg-success-50' : 'border-error-200 bg-error-50'}
      `}
    >
      {/* Decision banner */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`
            flex items-center justify-center w-12 h-12 rounded-xl shrink-0
            ${available ? 'bg-success-500' : 'bg-error-500'}
          `}
        >
          {available ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <XCircle className="w-7 h-7 text-white" />
          )}
        </div>
        <div>
          <h3
            className={`text-xl font-extrabold ${available ? 'text-success-700' : 'text-error-700'}`}
          >
            {available ? 'Available' : 'Unavailable'}
          </h3>
          <p className={`text-sm ${available ? 'text-success-600' : 'text-error-600'}`}>
            {available
              ? 'This room is free for your requested time slot.'
              : 'This room cannot be booked for the requested time slot.'}
          </p>
        </div>
      </div>

      {/* Summary card */}
      {room && (
        <div className="rounded-xl bg-white/70 border border-white p-4 space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Room</span>
            <span className="text-slate-800 font-bold">{room.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Time slot</span>
            <span className="text-slate-800 font-bold tabular-nums">
              {fmt(interval.start)} – {fmt(interval.end)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Duration</span>
            <span
              className={`font-bold tabular-nums ${
                duration > 120 ? 'text-error-600' : 'text-slate-800'
              }`}
            >
              {fmtDuration(duration)}
              {duration > 120 && ' (over limit)'}
            </span>
          </div>
        </div>
      )}

      {/* Errors list */}
      {!available && result.errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.errors.map((err, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-error-100/60 border border-error-200"
            >
              <AlertCircle className="w-4 h-4 text-error-500 shrink-0 mt-0.5" />
              <p className="text-sm text-error-700 font-medium">{err}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
