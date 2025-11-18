"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Resolution } from "@/types";
import { MAX_CONCURRENT_RESOLUTIONS } from "@/constants";
import { supabase } from "@/lib/supabaseClient";
import { DraggableCanvas } from "@/components/dashboard/DraggableCanvas";
import { ResolutionCircleView } from "@/components/dashboard/ResolutionCircleView";

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
    <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white p-6 overflow-y-auto">
        <header className="space-y-4 mb-8">
          <div>
            <p className="text-sm text-slate-500">Hello,</p>
            <h1 className="text-2xl font-bold text-slate-900">
              {user?.email ?? "friend"}
            </h1>
          </div>

          <div className="space-y-2">
            <Link
              href="/dashboard/new"
              className={`block w-full text-center rounded-md px-4 py-2.5 text-sm font-medium text-white transition ${
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
              <p className="text-xs text-slate-500 text-center">
                {activeResolutions.length} of {MAX_CONCURRENT_RESOLUTIONS}{" "}
                active resolution{activeResolutions.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {!canCreateNew && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-700">
                You&apos;ve reached the maximum of {MAX_CONCURRENT_RESOLUTIONS}{" "}
                active resolutions. Complete one to create a new resolution.
              </p>
            </div>
          )}
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Completed Resolutions List */}
        {completedResolutions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Completed Resolutions
            </h2>
            <ul className="space-y-2">
              {completedResolutions.map((resolution) => (
                <li
                  key={resolution.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                >
                  <h3 className="font-medium text-slate-900">
                    {resolution.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Completed on {formatDate(resolution.target_date)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {resolutions.length === 0 && !error && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No resolutions yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Create your first resolution to start tracking your progress.
            </p>
          </div>
        )}
      </aside>

      {/* Main draggable area */}
      <main className="flex-1 relative bg-slate-50">
        {activeResolutions.length > 0 ? (
          <DraggableCanvas>
            <ResolutionCircleView resolutions={activeResolutions} />
          </DraggableCanvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                No active resolutions
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create a resolution to see it displayed here.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
