"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ResolutionPageProps {
  params: {
    resolutionId: string;
  };
}

export default function ResolutionDetailPage({ params }: ResolutionPageProps) {
  const { resolutionId } = params;
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        ← Back to dashboard
      </Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">
          Resolution: {resolutionId}
        </h1>
        <p className="text-sm text-slate-600">
          Detailed tracking for this resolution will go here.
        </p>
      </header>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Habits</h2>
        <p className="mt-2 text-sm text-slate-600">
          Habit details and check-ins will be rendered once data fetching is
          wired up.
        </p>
      </section>
    </div>
  );
}
