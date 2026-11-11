import { GraduationCap, Clock } from 'lucide-react';
import { fmt } from '@/lib/validation';
import { CURRENT_TIME_MIN } from '@/data/rooms';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white">
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-accent-500 rounded-full blur-3xl opacity-10" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <GraduationCap className="w-6 h-6 text-primary-200" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-primary-200/90 uppercase">
            Smart Campus
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          Room Availability Checker
        </h1>
        <p className="mt-3 text-primary-100/80 text-base sm:text-lg max-w-2xl leading-relaxed">
          Pick a room, choose your time slot, and instantly see whether it&apos;s available —
          no booking data is modified.
        </p>

        <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15">
          <Clock className="w-4 h-4 text-secondary-300" />
          <span className="text-sm font-medium text-primary-50">
            Current time: <span className="font-bold tabular-nums text-white">{fmt(CURRENT_TIME_MIN)}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
