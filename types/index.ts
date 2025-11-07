export type HabitFrequency = "daily" | "weekly";

export interface Resolution {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface Habit {
  id: string;
  resolution_id: string;
  title: string;
  frequency: HabitFrequency;
  created_at: string;
}

export interface Checkin {
  id: string;
  habit_id: string;
  checkin_date: string;
  completed: boolean;
}
