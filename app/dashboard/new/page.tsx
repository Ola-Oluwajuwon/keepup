"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ResolutionForm } from "@/components/forms/ResolutionForm";
import { MAX_CONCURRENT_RESOLUTIONS } from "@/constants";
import type { Resolution } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export default function NewResolutionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Get session token and fetch active resolution count
      supabase.auth.getSession().then(({ data: { session } }) => {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        fetch("/api/resolutions", { headers })
          .then(async (response) => {
            if (!response.ok) return;
            const { data } = await response.json();
            const activeResolutions = (data as Resolution[]).filter(
              (r) => r.status === "active"
            );
            setActiveCount(activeResolutions.length);
          })
          .catch(() => {
            // Silently fail - we'll show the form anyway
          })
          .finally(() => {
            setLoadingCount(false);
          });
      });
    }
  }, [user]);

  if (loading || loadingCount) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const hasMaxResolutions =
    activeCount !== null && activeCount >= MAX_CONCURRENT_RESOLUTIONS;

  const handleCreated = () => {
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <header className="space-y-2">
        <Link
          href="/dashboard"
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back to dashboard
        </Link>
        <h1 className="text-3xl font-semibold text-slate-900">
          Create a new resolution
        </h1>
        <p className="text-sm text-slate-600">
          Set a meaningful goal and break it down into trackable habits.
        </p>
        {activeCount !== null && (
          <p className="text-sm text-slate-500">
            You have {activeCount} active resolution
            {activeCount !== 1 ? "s" : ""} (max {MAX_CONCURRENT_RESOLUTIONS})
          </p>
        )}
      </header>

      {hasMaxResolutions ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-semibold text-amber-900">
            Maximum resolutions reached
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            You've reached the maximum of {MAX_CONCURRENT_RESOLUTIONS} active
            resolutions. Complete or archive one of your existing resolutions
            to create a new one.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block rounded-md bg-amber-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ResolutionForm onCreated={handleCreated} />
        </div>
      )}
    </div>
  );
}

