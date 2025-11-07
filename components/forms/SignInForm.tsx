"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { signIn } from "@/lib/auth";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface SignInFormValues {
  email: string;
  password: string;
}

export function SignInForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    signIn(values.email, values.password)
      .then(() => {
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
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password.message}</p>
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
        loadingText="Signing in..."
      >
        Sign in
      </Button>
    </form>
  );
}
