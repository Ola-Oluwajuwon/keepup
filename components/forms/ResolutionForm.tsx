"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PRIVACY_OPTIONS } from "@/constants";
import type { PrivacyOption } from "@/types";
import { supabase } from "@/lib/supabaseClient";

interface ResolutionFormValues {
  title: string;
  description: string;
  why_text: string;
  start_date: string;
  target_date: string;
  privacy: PrivacyOption;
}

export function ResolutionForm({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const defaultTargetDate = nextYear.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ResolutionFormValues>({
    defaultValues: {
      title: "",
      description: "",
      why_text: "",
      start_date: today,
      target_date: defaultTargetDate,
      privacy: "private",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const startDate = watch("start_date");

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    // Validate date range
    if (values.target_date < values.start_date) {
      setErrorMessage("Target date must be on or after start date.");
      setIsSubmitting(false);
      return;
    }

    // Get session token and send it with the request
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        return fetch("/api/resolutions", {
          method: "POST",
          headers,
          body: JSON.stringify(values),
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Something went wrong.");
        }
        return response.json();
      })
      .then(() => {
        reset();
        onCreated?.();
        router.push("/dashboard");
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
          Resolution title *
        </label>
        <Input
          id="title"
          placeholder="Run a half marathon"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
        />
        {errors.title ? (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="why_text"
          className="text-sm font-medium text-slate-700"
        >
          Why is this important to you? *
        </label>
        <textarea
          id="why_text"
          className="min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="This helps you stay motivated when things get tough. What drives you to achieve this goal?"
          {...register("why_text", {
            required: "Please explain why this resolution matters to you",
            minLength: {
              value: 10,
              message: "Please provide at least 10 characters",
            },
          })}
        />
        <p className="text-xs text-slate-500">
          {watch("why_text")?.length || 0} characters
        </p>
        {errors.why_text ? (
          <p className="text-sm text-red-600">{errors.why_text.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="start_date"
            className="text-sm font-medium text-slate-700"
          >
            Start date
          </label>
          <Input
            id="start_date"
            type="date"
            min={today}
            {...register("start_date", {
              required: "Start date is required",
            })}
          />
          {errors.start_date ? (
            <p className="text-sm text-red-600">{errors.start_date.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="target_date"
            className="text-sm font-medium text-slate-700"
          >
            Target date *
          </label>
          <Input
            id="target_date"
            type="date"
            min={startDate || today}
            {...register("target_date", {
              required: "Target date is required",
              validate: (value) => {
                if (startDate && value < startDate) {
                  return "Target date must be on or after start date";
                }
                return true;
              },
            })}
          />
          {errors.target_date ? (
            <p className="text-sm text-red-600">{errors.target_date.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="privacy" className="text-sm font-medium text-slate-700">
          Privacy
        </label>
        <select
          id="privacy"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          {...register("privacy")}
        >
          {PRIVACY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">
          Private resolutions are only visible to you. Public resolutions can be
          shared with accountability groups.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          className="min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
        loadingText="Creating..."
      >
        Create resolution
      </Button>
    </form>
  );
}
