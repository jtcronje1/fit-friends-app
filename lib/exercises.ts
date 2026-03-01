import { ExerciseType } from '@/types';

export const PRESET_EXERCISES: ExerciseType[] = [
  {
    id: 'running',
    name: 'Running/Jogging',
    unit: 'km',
    points_per: 10,
    unit_amount: 1,
    icon: '🏃',
  },
  {
    id: 'trail-running',
    name: 'Trail Running',
    unit: 'km',
    points_per: 10,
    unit_amount: 0.8,
    icon: '🏔️',
  },
  {
    id: 'walking',
    name: 'Brisk Walking',
    unit: 'km',
    points_per: 10,
    unit_amount: 2,
    icon: '🚶',
  },
  {
    id: 'cycling',
    name: 'Cycling',
    unit: 'km',
    points_per: 10,
    unit_amount: 3.6,
    icon: '🚴',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    unit: 'm',
    points_per: 10,
    unit_amount: 250,
    icon: '🏊',
  },
  {
    id: 'rowing',
    name: 'Rowing',
    unit: 'm',
    points_per: 10,
    unit_amount: 850,
    icon: '🚣',
  },
  {
    id: 'golf',
    name: 'Golf',
    unit: 'holes',
    points_per: 20,
    unit_amount: 9,
    icon: '⛳',
  },
  {
    id: 'stairs-time',
    name: 'Stair Climbing (Time)',
    unit: 'mins',
    points_per: 10,
    unit_amount: 5,
    icon: '📈',
  },
  {
    id: 'stairs-flights',
    name: 'Stair Climbing (Flights)',
    unit: 'flights',
    points_per: 10,
    unit_amount: 25,
    icon: '📶',
  },
  {
    id: 'gym-high',
    name: 'Gym (High Intensity)',
    unit: 'mins',
    points_per: 10,
    unit_amount: 10,
    icon: '💪',
  },
  {
    id: 'gym-medium',
    name: 'Gym (Medium Intensity)',
    unit: 'mins',
    points_per: 10,
    unit_amount: 20,
    icon: '🏋️',
  },
  {
    id: 'gym-low',
    name: 'Gym (Low Intensity)',
    unit: 'mins',
    points_per: 10,
    unit_amount: 30,
    icon: '🧘',
  },
  {
    id: 'tennis',
    name: 'Tennis/Squash/Padel',
    unit: 'mins',
    points_per: 10,
    unit_amount: 20,
    icon: '🎾',
  },
];

// Calculate points for an exercise
export function calculatePoints(
  exerciseId: string,
  measurement: number
): number {
  const exercise = PRESET_EXERCISES.find((e) => e.id === exerciseId);
  if (!exercise) return 0;
  
  const points = Math.floor((measurement / exercise.unit_amount) * exercise.points_per);
  return Math.max(0, points);
}

// Get the next Monday from a given date
export function getNextMonday(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 1 : 8);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get challenge end date (28 days from start)
export function getChallengeEndDate(startDate: Date): Date {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 27); // 28 days total (including start)
  end.setHours(23, 59, 59, 999);
  return end;
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Check if date is within challenge period
export function isWithinChallenge(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

// Generate HSL colors for team members
export const MEMBER_COLORS = [
  { h: 0, s: 70, l: 50 },   // Red
  { h: 30, s: 70, l: 50 },  // Orange
  { h: 60, s: 70, l: 45 },  // Yellow
  { h: 120, s: 60, l: 45 }, // Green
  { h: 180, s: 70, l: 45 }, // Cyan
  { h: 210, s: 70, l: 55 }, // Blue
  { h: 270, s: 60, l: 55 }, // Purple
  { h: 300, s: 60, l: 50 }, // Magenta
  { h: 330, s: 70, l: 55 }, // Pink
  { h: 150, s: 60, l: 45 }, // Teal
  { h: 45, s: 80, l: 50 },  // Gold
  { h: 240, s: 60, l: 55 }, // Indigo
];

export function getMemberColor(index: number): string {
  const color = MEMBER_COLORS[index % MEMBER_COLORS.length];
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

// Sample daily quotes
export const DAILY_QUOTES = [
  { quote: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { quote: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { quote: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian" },
  { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { quote: "A one-hour workout is 4% of your day. No excuses.", author: "Unknown" },
  { quote: "Sweat is just fat crying.", author: "Unknown" },
  { quote: "The hardest lift of all is lifting your butt off the couch.", author: "Unknown" },
  { quote: "Discipline is doing what needs to be done, even if you don't want to do it.", author: "Unknown" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "Train insane or remain the same.", author: "Unknown" },
  { quote: "Your only limit is you.", author: "Unknown" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Don't wish for it, work for it.", author: "Unknown" },
  { quote: "Every workout is a step closer to your goal.", author: "Unknown" },
  { quote: "Strive for progress, not perfection.", author: "Unknown" },
  { quote: "The only way to define your limits is by going beyond them.", author: "Arthur Clarke" },
  { quote: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Winners train, losers complain.", author: "Unknown" },
  { quote: "If it doesn't challenge you, it doesn't change you.", author: "Fred DeVito" },
  { quote: "Tough times don't last. Tough people do.", author: "Robert H. Schuller" },
  { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { quote: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { quote: "Fall in love with taking care of yourself.", author: "Unknown" },
  { quote: "Be stronger than your excuses.", author: "Unknown" },
  { quote: "Make your body the sexiest outfit you own.", author: "Unknown" },
];
