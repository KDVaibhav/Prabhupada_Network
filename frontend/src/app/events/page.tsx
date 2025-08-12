"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

type EventT = {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  imageUrl?: string;
  parentEventId?: any;
  schedule?: { fields: string[]; rows: string[][] };
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function isFuture(dateStr?: string) {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() >= new Date().setHours(0, 0, 0, 0);
}
function monthKey(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function clsx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

// -------------------- Atoms --------------------
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
const IconGrid = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
  </svg>
);
const IconTimeline = (props: any) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    {...props}
  >
    <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h7" />
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

// -------------------- Skeletons & Empty --------------------
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
    <div className="mb-3 text-5xl">🕉️</div>
    <h3 className="text-lg font-semibold text-fontApp">{title}</h3>
    {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
  </div>
);

// -------------------- Schedule Modal (preserved) --------------------
function ScheduleModal({ open, onClose, onSave, eventId }: any) {
  const [fields, setFields] = useState([
    "Time",
    "Activity",
    "Speaker",
    "Location",
  ]);
  const [rows, setRows] = useState([["", "", "", ""]]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleFieldChange = (idx: number, value: string) => {
    const next = [...fields];
    next[idx] = value;
    setFields(next);
  };
  const handleRowChange = (r: number, c: number, value: string) => {
    setRows((prev) =>
      prev.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row
      )
    );
  };
  const addField = () => {
    setFields((f) => [...f, `Field ${f.length + 1}`]);
    setRows((rs) => rs.map((r) => [...r, ""]));
  };
  const addRow = () => setRows((r) => [...r, Array(fields.length).fill("")]);
  const removeField = (idx: number) => {
    setFields((f) => f.filter((_, i) => i !== idx));
    setRows((rs) => rs.map((r) => r.filter((_, i) => i !== idx)));
  };
  const removeRow = (idx: number) =>
    setRows((rs) => rs.filter((_, i) => i !== idx));

  const handleSave = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/event/${eventId}/schedule`,
      { fields, rows },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    onSave();
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary2 to-orange-400 text-white">
          <h2 className="text-lg font-bold">Create / Edit Schedule</h2>
          <button
            className="rounded-full p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full border-collapse">
              <thead className="bg-primary2 text-white">
                <tr>
                  {fields.map((f, i) => (
                    <th key={i} className="p-2 text-left">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-28 bg-transparent border-b border-white/70 text-white font-semibold focus:outline-none"
                          value={f}
                          onChange={(e) => handleFieldChange(i, e.target.value)}
                        />
                        {fields.length > 1 && (
                          <button
                            className="text-white/80 hover:text-white text-xs"
                            onClick={() => removeField(i)}
                            title="Remove field"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="p-2 border-t">
                        <input
                          className="w-full rounded-md border border-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary2/40"
                          value={cell}
                          onChange={(e) =>
                            handleRowChange(ri, ci, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td className="p-2 border-t text-center">
                      {rows.length > 1 && (
                        <button
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeRow(ri)}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
              onClick={addField}
            >
              + Add Field
            </button>
            <button
              className="rounded-lg bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
              onClick={addRow}
            >
              + Add Row
            </button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-primary2 text-white hover:bg-primary2/90"
              onClick={handleSave}
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Event Detail Modal (refined) --------------------
function EventDetailModal({
  open,
  onClose,
  event,
  isAuthenticated,
  onEditSchedule,
}: any) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e:any) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!open || !event) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div ref={modalRef} className="relative">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          <button
            className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            ×
          </button>

          <div className="flex items-center gap-4 p-6 pb-3">
            <img
              src={event.imageUrl || "/event-placeholder.jpg"}
              alt={event.title}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-fontApp">
                {event.title}
              </h2>
              <div className="mt-1 text-sm text-gray-600 flex flex-wrap items-center gap-2">
                <Badge>{formatDate(event.date)}</Badge>
                <span className="text-gray-400">•</span>
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="inline w-5 h-5 text-primary2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {event.location}
                </span>
              </div>
            </div>
          </div>

          {event.description && (
            <p className="px-6 pb-2 text-gray-700">{event.description}</p>
          )}

          {event.schedule?.fields?.length ? (
            <div className="px-6 mt-4 pb-6">
              <h3 className="text-sm font-semibold mb-2 text-primary2">
                Schedule
              </h3>
              <div className="overflow-x-auto rounded-lg ring-1 ring-gray-200">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-primary2 text-white">
                      {event.schedule.fields.map((f: string, i: number) => (
                        <th key={i} className="py-2 px-3 text-left">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {event.schedule.rows.map((row: string[], ri: number) => (
                      <tr
                        key={ri}
                        className={ri % 2 ? "bg-white" : "bg-gray-50"}
                      >
                        {row.map((cell, ci) => (
                          <td key={ci} className="py-2 px-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            {isAuthenticated && (
              <button
                className="bg-primary2 text-white px-4 py-2 rounded-xl shadow font-bold hover:bg-primary2/90"
                onClick={() => onEditSchedule(event)}
              >
                {event.schedule ? "Edit Schedule" : "Add Schedule"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Main Page --------------------
export default function EventsPage() {
  const [events, setEvents] = useState<EventT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("all");
  const [view, setView] = useState<"grid" | "timeline">("grid");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  // modals
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<EventT | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleEvent, setScheduleEvent] = useState<EventT | null>(null);

  const { isAuthenticated } = useSelector(
    (s: { auth: { isAuthenticated: boolean } }) => s.auth
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/event`
        );
        setEvents(res.data || []);
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            "Couldn't load events. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [refresh]);

  // Parent events only
  const parents = useMemo(
    () =>
      events.filter(
        (e) =>
          !e.parentEventId || e.parentEventId === "" || e.parentEventId === null
      ),
    [events]
  );

  // Derived lists
  const locations = useMemo(() => {
    const set = new Set<string>();
    parents.forEach((e) => e.location && set.add(e.location));
    return Array.from(set).sort();
  }, [parents]);

  const months = useMemo(() => {
    const set = new Set<string>();
    parents.forEach((e) => e.date && set.add(monthKey(e.date)));
    return Array.from(set).sort();
  }, [parents]);

  // Combined filter
  const filtered = useMemo(() => {
    let list = parents.slice();
    if (tab === "upcoming") list = list.filter((e) => isFuture(e.date));
    if (tab === "past") list = list.filter((e) => !isFuture(e.date));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }
    if (location) list = list.filter((e) => e.location === location);
    if (month) list = list.filter((e) => monthKey(e.date) === month);

    // sort: upcoming asc, past desc, all asc
    list.sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      if (tab === "past") return db - da;
      return da - db;
    });

    return list;
  }, [parents, tab, query, location, month]);

  const childEventsByParent = useMemo(() => {
    const map: Record<string, EventT[]> = {};
    events.forEach((e) => {
      if (
        e.parentEventId &&
        e.parentEventId !== "" &&
        e.parentEventId !== null
      ) {
        const key =
          typeof e.parentEventId === "object" && (e.parentEventId as any).$oid
            ? (e.parentEventId as any).$oid
            : String(e.parentEventId);
        if (!map[key]) map[key] = [];
        map[key].push(e);
      }
    });
    return map;
  }, [events]);

  const openDetail = (e: EventT) => {
    setDetailEvent(e);
    setDetailOpen(true);
  };
  const openSchedule = (e: EventT) => {
    setScheduleEvent(e);
    setScheduleOpen(true);
  };

  // -------------------- UI --------------------
  return (
    <div className="mt-4 min-h-screen">
      {/* Hero */}
      <div className="relative rounded-2xl isolate w-full h-60 md:h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
          alt="Events"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary2/85 to-orange-400/70 mix-blend-multiply" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Events
          </h1>
          <p className="text-sm md:text-base text-white/90 mt-2 max-w-2xl mx-auto">
            Discover gatherings, kirtans, and festivals. Filter by month, place,
            or search anything.
          </p>
        </div>
      </div>

      {/* AppBar */}
      <div className="sticky top-0 z-40 rounded-2xl mt-2 bg-bgApp2 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl p-1 bg-gray-100 border border-gray-200">
            {(["upcoming", "past", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition",
                  tab === t
                    ? "bg-white shadow border border-gray-200"
                    : "text-gray-600 hover:bg-white"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <IconSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, place, description..."
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary2/30"
              />
            </div>
          </div>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm"
          >
            <option value="">Any month</option>
            {months.map((m) => {
              const [y, mo] = m.split("-");
              const dt = new Date(Number(y), Number(mo) - 1, 1);
              const label = dt.toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              });
              return (
                <option key={m} value={m}>
                  {label}
                </option>
              );
            })}
          </select>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-xl p-1 bg-gray-100 border border-gray-200">
            <button
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2",
                view === "grid" ? "bg-white shadow" : "text-gray-600"
              )}
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <IconGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2",
                view === "timeline" ? "bg-white shadow" : "text-gray-600"
              )}
              onClick={() => setView("timeline")}
              aria-label="Timeline view"
            >
              <IconTimeline className="w-4 h-4" />
              Timeline
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No events found"
            hint="Try changing filters or clearing the search query."
          />
        ) : view === "grid" ? (
          <GridView
            events={filtered}
            childEventsByParent={childEventsByParent}
            isAuthenticated={isAuthenticated}
            onOpenDetail={openDetail}
            onOpenSchedule={openSchedule}
          />
        ) : (
          <TimelineView
            events={filtered}
            isAuthenticated={isAuthenticated}
            onOpenDetail={openDetail}
            onOpenSchedule={openSchedule}
          />
        )}
      </div>

      {/* Modals */}
      <EventDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        event={detailEvent}
        isAuthenticated={isAuthenticated}
        onEditSchedule={openSchedule}
      />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSave={() => setRefresh((r) => !r)}
        eventId={scheduleEvent?._id}
      />
    </div>
  );
}

// -------------------- Views --------------------
function GridView({
  events,
  childEventsByParent,
  isAuthenticated,
  onOpenDetail,
  onOpenSchedule,
}: {
  events: EventT[];
  childEventsByParent: Record<string, EventT[]>;
  isAuthenticated: boolean;
  onOpenDetail: (e: EventT) => void;
  onOpenSchedule: (e: EventT) => void;
}) {
  return (
    <div className=" grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <article
          key={e._id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white/60 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            backgroundImage:
              "linear-gradient(white, white), radial-gradient(1200px circle at 0% 0%, rgba(255,87,34,0.25), transparent 40%)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <div className="relative h-44">
            <img
              src={e.imageUrl || "/event-placeholder.jpg"}
              alt={e.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge>{formatDate(e.date)}</Badge>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3
              className="text-xl font-extrabold text-fontApp group-hover:text-primary2 transition-colors cursor-pointer"
              onClick={() => onOpenDetail(e)}
            >
              {e.title}
            </h3>
            <div className="mt-1 mb-3 flex items-center gap-2 text-gray-600">
              <svg
                className="w-4 h-4 text-primary2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{e.location}</span>
            </div>
            {e.description && (
              <p className="text-gray-700 line-clamp-3">{e.description}</p>
            )}

            {/* Sub-events */}
            {childEventsByParent[e._id]?.length ? (
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">
                  Sub events
                </div>
                <div className="flex flex-wrap gap-2">
                  {childEventsByParent[e._id].map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => onOpenDetail(c)}
                      title="View sub-event"
                      className="rounded-full bg-fontApp/10 text-fontApp px-2.5 py-1 text-xs font-semibold hover:bg-fontApp/20 transition focus:outline-none focus:ring-2 focus:ring-fontApp/30"
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
              <button
                className="px-3 py-2 rounded-lg text-sm font-bold text-primary2 hover:bg-primary2/10"
                onClick={() => onOpenDetail(e)}
              >
                View details
              </button>
              {isAuthenticated && (
                <button
                  className="inline-flex items-center justify-center rounded-lg bg-primary2 px-3 py-2 text-sm font-bold text-white shadow hover:bg-primary2/90"
                  onClick={() => onOpenSchedule(e)}
                >
                  {e.schedule ? "Edit schedule" : "Add schedule"}
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function TimelineView({
  events,
  isAuthenticated,
  onOpenDetail,
  onOpenSchedule,
}: {
  events: EventT[];
  isAuthenticated: boolean;
  onOpenDetail: (e: EventT) => void;
  onOpenSchedule: (e: EventT) => void;
}) {
  // Group by month
  const groups = useMemo(() => {
    const map: Record<string, EventT[]> = {};
    events.forEach((e) => {
      const k = monthKey(e.date) || "unknown";
      if (!map[k]) map[k] = [];
      map[k].push(e);
    });
    // sort events within month
    Object.values(map).forEach((arr) =>
      arr.sort(
        (a, b) =>
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
      )
    );
    return Object.entries(map).sort(([a], [b]) => (a > b ? 1 : -1));
  }, [events]);

  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary2/30 to-transparent" />
      <div className="space-y-10">
        {groups.map(([k, arr], gi) => {
          const [y, mo] = k.split("-");
          const dt = new Date(Number(y), Number(mo) - 1, 1);
          const label = isFinite(dt.getTime())
            ? dt.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })
            : "Undated";

          return (
            <section key={k} className="relative">
              <div className="flex items-center gap-3 mb-4 md:mb-8">
                <div className="h-2 w-2 rounded-full bg-primary2" />
                <h2 className="text-sm md:text-base font-bold text-fontApp2">
                  {label}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {arr.map((e, i) => (
                  <article
                    key={e._id}
                    className={clsx(
                      "relative rounded-2xl border bg-white/70 shadow-sm p-5",
                      "hover:shadow-lg hover:-translate-y-0.5 transition"
                    )}
                    style={{
                      backgroundImage:
                        "linear-gradient(white, white), radial-gradient(800px circle at 0% 0%, rgba(255,87,34,0.18), transparent 40%)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={e.imageUrl || "/event-placeholder.jpg"}
                        alt={e.title}
                        className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge>{formatDate(e.date)}</Badge>
                          {e.location && (
                            <span className="text-xs text-gray-600">
                              • {e.location}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-extrabold text-fontApp truncate">
                          {e.title}
                        </h3>
                        {e.description && (
                          <p className="text-gray-700 line-clamp-2 mt-1">
                            {e.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            className="text-primary2 font-bold text-sm hover:underline"
                            onClick={() => onOpenDetail(e)}
                          >
                            View details
                          </button>
                          {isAuthenticated && (
                            <button
                              className="inline-flex items-center justify-center rounded-lg bg-primary2 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-primary2/90"
                              onClick={() => onOpenSchedule(e)}
                            >
                              {e.schedule ? "Edit schedule" : "Add schedule"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
