"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Resolution } from "@/types";
import { MAX_CONCURRENT_RESOLUTIONS } from "@/constants";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loadingResolutions, setLoadingResolutions] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Get session token and send it with the request
      supabase.auth.getSession().then(({ data: { session } }) => {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        fetch("/api/resolutions", {
          headers,
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch resolutions");
            }
            const { data } = await response.json();
            setResolutions(data as Resolution[]);
          })
          .catch((err) => {
            setError(
              err instanceof Error ? err.message : "Failed to load resolutions"
            );
          })
          .finally(() => {
            setLoadingResolutions(false);
          });
      });
    }
  }, [user]);

  if (loading || loadingResolutions) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const activeResolutions = resolutions.filter((r) => r.status === "active");
  const completedResolutions = resolutions.filter(
    (r) => r.status === "completed"
  );
  const canCreateNew = activeResolutions.length < MAX_CONCURRENT_RESOLUTIONS;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header className="space-y-2">
        <p className="text-sm text-slate-500">
          Hello, {user?.email ?? "friend"}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Your KeepUp dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Track the habits that move your resolutions forward.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/new"
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition ${
              canCreateNew
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-slate-400 cursor-not-allowed"
            }`}
            onClick={(e) => {
              if (!canCreateNew) {
                e.preventDefault();
              }
            }}
          >
            Add new resolution
          </Link>
          {activeResolutions.length > 0 && (
            <p className="text-sm text-slate-500">
              {activeResolutions.length} of {MAX_CONCURRENT_RESOLUTIONS} active
              resolution{activeResolutions.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {!canCreateNew && (
          <p className="text-sm text-amber-600">
            You&apos;ve reached the maximum of {MAX_CONCURRENT_RESOLUTIONS}{" "}
            active resolutions. Complete one to create a new resolution.
          </p>
        )}
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {activeResolutions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Active Resolutions
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {activeResolutions.map((resolution) => (
              <li
                key={resolution.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-slate-900">
                      {resolution.title}
                    </h3>
                    {resolution.why_text && (
                      <p className="mt-2 text-sm text-slate-600 italic">
                        &ldquo;{resolution.why_text}&rdquo;
                      </p>
                    )}
                    {resolution.description && (
                      <p className="mt-2 text-sm text-slate-600">
                        {resolution.description}
                      </p>
                    )}
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p>Target: {formatDate(resolution.target_date)}</p>
                      <p className="capitalize">
                        Privacy: {resolution.privacy}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/${resolution.id}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-slate-900 hover:underline"
                >
                  View progress →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {completedResolutions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Completed Resolutions
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {completedResolutions.map((resolution) => (
              <li
                key={resolution.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm opacity-75"
              >
                <h3 className="text-lg font-medium text-slate-900">
                  {resolution.title}
                </h3>
                {resolution.description && (
                  <p className="mt-2 text-sm text-slate-600">
                    {resolution.description}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  Completed on {formatDate(resolution.target_date)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {resolutions.length === 0 && !error && (
        <section className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No resolutions yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Create your first resolution to start tracking your progress.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create your first resolution
          </Link>
        </section>
      )}
    </div>
  );
}
