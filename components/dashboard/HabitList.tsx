"use client";

import type { Habit } from "@/types";

import { Card } from "@/components/ui/Card";

import { CheckinButton } from "./CheckinButton";

interface HabitListProps {
  habits: Habit[];
  onCheckIn?: (habitId: string) => Promise<void> | void;
}

export function HabitList({ habits, onCheckIn }: HabitListProps) {
  if (!habits?.length) {
    return (
      <Card
        title="Habits"
        description="Create habits to support this resolution."
        className="text-sm text-slate-600"
      >
        No habits yet. Use the habit form to add your first one.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <Card key={habit.id} title={habit.title} className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span className="capitalize">{habit.frequency}</span>
            <CheckinButton habitId={habit.id} onCompleted={onCheckIn} />
          </div>
        </Card>
      ))}
    </div>
  );
}
