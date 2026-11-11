export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  type: 'Lecture Hall' | 'Lab' | 'Seminar Room' | 'Auditorium';
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  title: string;
  start: number; // minutes from 00:00 (0–1440)
  end: number; // minutes from 00:00 (0–1440)
  bookedBy: string;
}

export interface Interval {
  start: number;
  end: number;
}

export type Decision = 'available' | 'unavailable' | null;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  decision: Decision;
  matchedRule?: string;
}

// ── Fictional sample data ──────────────────────────────────────────

export const CURRENT_TIME_MIN = 540; // 9:00 AM — fixed "current time" for demo

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Room A-101',
    building: 'Engineering Block',
    capacity: 120,
    equipment: ['Projector', 'Whiteboard', 'Microphone', 'Video Conferencing'],
    type: 'Lecture Hall',
    blocked: false,
    bookings: [
      { id: 'b1', title: 'Data Structures Lecture', start: 540, end: 630, bookedBy: 'Dr. Chen' },
      { id: 'b2', title: 'Faculty Meeting', start: 780, end: 840, bookedBy: 'Admin Office' },
      { id: 'b3', title: 'Guest Seminar', start: 960, end: 1020, bookedBy: 'CS Dept' },
    ],
  },
  {
    id: 'r2',
    name: 'Room A-102',
    building: 'Engineering Block',
    capacity: 45,
    equipment: ['Projector', 'Whiteboard', 'Video Conferencing'],
    type: 'Seminar Room',
    blocked: false,
    bookings: [
      { id: 'b4', title: 'Project Demo', start: 600, end: 660, bookedBy: 'Team Alpha' },
      { id: 'b5', title: 'Workshop: Rust Basics', start: 840, end: 960, bookedBy: 'IEEE SB' },
    ],
  },
  {
    id: 'r3',
    name: 'Lab B-201',
    building: 'Science Block',
    capacity: 30,
    equipment: ['Computers', 'Lab Equipment', 'Whiteboard'],
    type: 'Lab',
    blocked: true,
    blockedReason: 'Equipment maintenance scheduled',
    bookings: [
      { id: 'b6', title: 'Chemistry Practicals', start: 540, end: 600, bookedBy: 'Dr. Patel' },
    ],
  },
  {
    id: 'r4',
    name: 'Auditorium C',
    building: 'Main Building',
    capacity: 300,
    equipment: ['Projector', 'Microphone', 'Speakers', 'Video Conferencing'],
    type: 'Auditorium',
    blocked: false,
    bookings: [
      { id: 'b7', title: 'Annual Tech Fest Rehearsal', start: 720, end: 840, bookedBy: 'Cultural Committee' },
      { id: 'b8', title: 'Alumni Talk', start: 1020, end: 1140, bookedBy: 'Alumni Cell' },
    ],
  },
  {
    id: 'r5',
    name: 'Room D-305',
    building: 'Business Block',
    capacity: 60,
    equipment: ['Projector', 'Computers', 'Whiteboard'],
    type: 'Lecture Hall',
    blocked: false,
    bookings: [],
  },
];
