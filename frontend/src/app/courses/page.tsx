import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-[80vh] w-full grid place-items-center bg-bgApp px-4 py-16">
      <section className="relative isolate w-full max-w-3xl overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-sm backdrop-blur">
        {/* Decorative gradient blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary2/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary1/30 blur-3xl"
        />

        <div className="relative z-10 p-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary2/10 px-3 py-1 text-xs font-semibold text-primary2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M12 2a7 7 0 00-7 7v3.586l-1.707 1.707A1 1 0 004 16h16a1 1 0 00.707-1.707L19 12.586V9a7 7 0 00-7-7zm0 20a3 3 0 003-3H9a3 3 0 003 3z" />
            </svg>
            Coming Soon
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-fontApp sm:text-4xl">
            Courses
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-sm leading-relaxed text-fontApp2/90">
            We’re crafting structured learning around Srila Prabhupada’s teachings—
            bite‑sized lessons, quizzes, and guided study plans. Please check back
            soon.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-primary2/30 bg-primary2/90 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary2 focus:outline-none focus:ring-2 focus:ring-primary2/50"
            >
              Back to Home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-xl border border-fontApp/20 bg-white/70 px-4 py-2 text-sm font-semibold text-fontApp shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary1/40"
            >
              See Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}