import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-12 px-6 py-24">
      <section className="space-y-6 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          KeepUp // Habit tracking for real momentum
        </p>
        <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
          Stay consistent with your resolutions all year long.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          KeepUp helps you turn intentions into action with habit plans, gentle
          reminders, and progress insights designed for personal growth.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create your account
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-400"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {["Plan habits", "Track progress", "Celebrate wins"].map((feature) => (
          <div
            key={feature}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">{feature}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Placeholder content describing how KeepUp will help you stay on
              track.
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
