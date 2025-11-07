import Link from "next/link";

import { ensureAuthenticated } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await ensureAuthenticated();

  const placeholderResolutions = [
    {
      id: "placeholder-1",
      title: "Morning routine",
      description: "Wake up early and journal.",
    },
    {
      id: "placeholder-2",
      title: "Weekly workout",
      description: "Hit the gym three times a week.",
    },
  ];

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
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add new resolution
        </Link>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Resolutions</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {placeholderResolutions.map((resolution) => (
            <li
              key={resolution.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-medium text-slate-900">
                {resolution.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {resolution.description}
              </p>
              <Link
                href={`/dashboard/${resolution.id}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-slate-900 hover:underline"
              >
                View progress
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
