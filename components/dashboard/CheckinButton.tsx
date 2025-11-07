"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

interface CheckinButtonProps {
  habitId: string;
  onCompleted?: (habitId: string) => Promise<void> | void;
}

export function CheckinButton({ habitId, onCompleted }: CheckinButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    fetch("/api/checkins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        habitId,
        checkinDate: new Date().toISOString(),
        completed: true,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Unable to record check-in");
        }
      })
      .then(() => onCompleted?.(habitId))
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";
        setErrorMessage(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="secondary"
        onClick={handleClick}
        isLoading={isSubmitting}
        loadingText="Saving..."
      >
        Mark complete
      </Button>
      {errorMessage ? (
        <p className="text-xs text-red-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}
