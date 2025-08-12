"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IconChevronDown } from "@tabler/icons-react";

import { BlogEditor } from "@/components/ui/BlogEditor";
import { BlogCard } from "@/components/ui/BlogCard";

// -------------------- Types & Utils --------------------
interface BlogItem {
  _id: string;
  title: string;
  imageUrl?: string;
  author?: string;
  date?: string | Date;
  tags?: string[];
  content?: string;
}
function clsx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

// -------------------- Atoms (mirroring events page) --------------------
const IconSearch = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
    />
  </svg>
);
const Chip = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "px-3 py-1.5 rounded-full text-sm font-semibold transition border",
      active
        ? "bg-primary2 text-white border-primary2 shadow"
        : "bg-white/70 text-fontApp border-gray-200 hover:bg-white"
    )}
  >
    {children}
  </button>
);
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-primary2/10 text-primary2 px-2.5 py-1 text-xs font-semibold">
    {children}
  </span>
);

// -------------------- Skeletons & Empty (mirroring events page) --------------------
const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/40 bg-white/60 shadow-sm overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-6 w-2/3 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="h-16 w-full bg-gray-200 rounded" />
    </div>
  </div>
);
const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary2/40 bg-white/60 p-10 text-center">
    <div className="mb-3 text-5xl">🪷</div>
    <h3 className="text-lg font-semibold text-fontApp">{title}</h3>
    {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
  </div>
);

// -------------------- Page --------------------
export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state (aligned with events page patterns)
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  const { isAuthenticated } = useSelector(
    (s: { auth: { isAuthenticated: boolean } }) => s.auth
  );

  // Load blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/blog`,
          { withCredentials: true }
        );
        setBlogs(res.data || []);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Couldn't load blogs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Derived: tags
  const allTags = useMemo(() => {
    const set = new Set<string>(["All"]);
    blogs.forEach((b) => (b.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [blogs]);

  // Filtered + sorted
  const filtered = useMemo(() => {
    let list = blogs.slice();

    if (activeTag !== "All")
      list = list.filter((b) => (b.tags || []).includes(activeTag));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    const byDate = (d?: string | Date) => (d ? new Date(d).getTime() : 0);
    if (sortBy === "newest")
      list = [...list].sort((a, b) => byDate(b.date) - byDate(a.date));
    if (sortBy === "oldest")
      list = [...list].sort((a, b) => byDate(a.date) - byDate(b.date));
    if (sortBy === "title")
      list = [...list].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );

    return list;
  }, [blogs, activeTag, query, sortBy]);

  return (
    <div className="mt-4 min-h-screen">
      {/* Hero (same composition as events page) */}
      <div className="relative rounded-2xl isolate w-full h-60 md:h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80"
          alt="Blogs"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary2/60 to-orange-400/40 mix-blend-multiply" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Blogs
          </h1>
          <p className="text-sm md:text-base text-white/90 mt-2 max-w-2xl mx-auto">
            Read reflections, lectures, and stories from the Srila Prabhupada
            Connection - Mayapur.
          </p>
        </div>
      </div>

      {/* AppBar (sticky, like events) */}
      <div className="sticky top-0 z-40 rounded-2xl mt-2 bg-bgApp2 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <IconSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, tag..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary2/30"
              />
            </div>
          </div>
          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm pr-10"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A–Z</option>
            </select>
            <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          </div>
        </div>
      </div>

      <div className=" mt-2 ">
        {/* Editor (only for auth) */}
        {isAuthenticated && (
          <section className="rounded-2xl border border-neutral-200 bg-white/80 shadow-sm p-4 sm:p-6">
            <div className="mb-2">
              <Badge>Write</Badge>
            </div>
            <BlogEditor />
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No blogs found"
            hint="Try changing filters or clearing the search query."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((b) => (
              <BlogCard key={b._id} blog={b as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
