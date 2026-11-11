# Smart Campus Room Availability Checker

A React + TypeScript application for checking fictional campus room availability.

## Requirements

- Node.js 20 or later
- npm

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Quality checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Features

- Five fictional rooms with individual booking schedules.
- Minimum-capacity filtering.
- Equipment filtering (a room must contain every selected item).
- Empty state when no room matches.
- Availability validation for time boundaries, maximum 120-minute duration, blocked rooms and booking overlaps.
- Availability checks do not create or modify bookings.

## Project structure

- `src/data/rooms.ts`: room and booking types and fictional room data.
- `src/lib/validation.ts`: availability validation rules.
- `src/lib/roomFilters.ts`: pure room filtering logic.
- `src/components/`: UI components.
- `src/lib/*.test.ts`: automated tests.

See `docs/assignment-04-report.md` for the assignment analysis, design decisions, test inventory and AI-use reflection.
