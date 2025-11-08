export type HabitFrequency = "daily" | "weekly";

export type ResolutionStatus = "active" | "completed";
export type PrivacyOption = "private" | "public";

export interface Resolution {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  why_text: string | null;
  start_date: string;
  target_date: string;
  privacy: PrivacyOption;
  status: ResolutionStatus;
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
