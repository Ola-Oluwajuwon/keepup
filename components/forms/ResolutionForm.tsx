"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ResolutionFormValues {
  title: string;
  description: string;
}

export function ResolutionForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResolutionFormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    fetch("/api/resolutions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Something went wrong.");
        }
      })
      .then(() => {
        reset();
        onCreated?.();
        router.refresh();
      })
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
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Resolution title
        </label>
        <Input
          id="title"
          placeholder="Run a half marathon"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Outline the habits or milestones you will use to stay on track."
          {...register("description")}
        />
        {errors.description ? (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        ) : null}
      </div>

      {errorMessage ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        loadingText="Saving..."
      >
        Save resolution
      </Button>
    </form>
  );
}
