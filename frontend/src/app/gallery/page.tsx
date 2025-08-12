"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import GallleryItem, { GalleryItemData } from "@/components/GallleryItem";
import { useSelector } from "react-redux";
import { Modal, TextInput, Select, FileInput, Button } from "flowbite-react";

function clsx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-primary2/10 text-primary2 px-2.5 py-1 text-xs font-semibold">
    {children}
  </span>
);
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

type Filter = "all" | "image" | "video";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<GalleryItemData | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [events, setEvents] = useState<{ _id: string; title: string, date: Date }[]>([]);

  const { isAuthenticated } = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) => state.auth
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/gallery`
        );
        setItems(res.data);
        const ev = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/event`
        );
        const parentEv = ev.data.filter((e: any) => e.parentEventId === "");
        const list = parentEv.map((e: any) => ({ _id: e._id, title: e.title, date: e.date }));
        setEvents(list);
        if (typeof window !== "undefined") {
          (window as any).__events = list;
        }
      } catch (e) {
        console.error("Failed to load gallery", e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);
  const filtered = useMemo(() => {
    return filter === "all"
      ? items
          .slice()
          .sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          )
      : items
          .filter((i) => i.mediaType === filter)
          .sort(
            (a, b) =>
              new Date(b.uploadedAt).getTime() -
              new Date(a.uploadedAt).getTime()
          );
  }, [items, filter]);

  // Group filtered items by eventId
  const itemsByEvent: { [eventId: string]: GalleryItemData[] } = {};
  filtered.forEach((item) => {
    let key = "";
    const eventId = item.eventId as string | { $oid: string } | undefined;
    if (!eventId) {
      key = "no_event";
    } else if (typeof eventId === "string") {
      key = eventId;
    } else if (typeof eventId === "object" && "$oid" in eventId) {
      key = eventId.$oid;
    } else {
      key = String(eventId);
    }
    if (!itemsByEvent[key]) itemsByEvent[key] = [];
    itemsByEvent[key].push(item);
  });

  return (
    <div className="mt-4 min-h-screen">
      {/* Hero (matched with Events page) */}
      <div className="relative rounded-2xl isolate w-full h-60 md:h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/PrabhupadaInspectingBhagavatam.jpg?updatedAt=1754987127116"
          alt="Gallery"
          className="absolute inset-0 h-full w-full object-cover object-[0_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary2/85 to-orange-400/70 mix-blend-multiply" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Gallery
          </h1>
          <p className="text-sm md:text-base text-white/90 mt-2 max-w-2xl mx-auto">
            Photos and videos from our events. Filter by type or browse all.
          </p>
        </div>
      </div>

      {/* AppBar (filters) */}
      <div className="sticky top-0 z-40 rounded-2xl mt-2 bg-white border-b border-gray-300 shadow-lg shadow-gray-400/10 backdrop-filter backdrop-brightness-125">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl p-1 bg-gray-100 border border-gray-200 ml-auto">
            {(["all", "image", "video"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition",
                  filter === f
                    ? "bg-white shadow border border-gray-200"
                    : "text-gray-600 hover:bg-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {isAuthenticated && (
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center rounded-xl bg-primary2 px-4 py-2 text-sm font-bold text-white shadow hover:bg-primary2/90 ml-auto"
            >
              Add to Gallery
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {[...events]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((ev) => (
                <section key={ev._id} className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-primary2" />
                    <h2 className="text-xl font-bold text-fontApp">
                      {ev.title}
                    </h2>
                    {ev.date ? (
                      <Badge>
                        {new Date(ev.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Badge>
                    ) : null}
                  </div>

                  {itemsByEvent[ev._id] && itemsByEvent[ev._id].length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {itemsByEvent[ev._id].map((it, idx) => (
                        <GallleryItem
                          key={it._id}
                          item={it}
                          index={idx}
                          onOpen={(i) => setActive(itemsByEvent[ev._id][i])}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-fontApp/70 rounded-xl border border-dashed border-primary2/30 bg-white/60">
                      No items for this event.
                    </div>
                  )}
                </section>
              ))}

            {itemsByEvent["no_event"] &&
              itemsByEvent["no_event"].length > 0 && (
                <section className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-primary2" />
                    <h2 className="text-xl font-bold text-fontApp">Other</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {itemsByEvent["no_event"].map((it, idx) => (
                      <GallleryItem
                        key={it._id}
                        item={it}
                        index={idx}
                        onOpen={(i) => setActive(itemsByEvent["no_event"][i])}
                      />
                    ))}
                  </div>
                </section>
              )}
          </>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {active.mediaType === "image" ? (
              <img
                src={active.url}
                alt={active.title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            ) : (
              <VideoEmbed url={active.url} />
            )}
            <div className="mt-3 flex items-center justify-between text-white">
              <p className="font-medium">{active.title}</p>
              <div className="inline-flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-black hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = filtered.findIndex(
                      (i) => i._id === active._id
                    );
                    if (currentIndex > 0) setActive(filtered[currentIndex - 1]);
                  }}
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-black hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = filtered.findIndex(
                      (i) => i._id === active._id
                    );
                    if (currentIndex >= 0 && currentIndex < filtered.length - 1)
                      setActive(filtered[currentIndex + 1]);
                  }}
                >
                  Next
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-black hover:bg-white"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <GalleryUploadModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onAdded={(it) => setItems((prev) => [it, ...prev])}
        />
      )}
    </div>
  );
}

function getYouTubeId(url: string): string | null {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([\w-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function GalleryUploadModal({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: (item: GalleryItemData) => void;
}) {
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [eventId, setEventId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle("");
    setMediaType("image");
    setUrl("");
    setFile(null);
    setError(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      let finalUrl = url;
      const token = localStorage.getItem("token");
      if (mediaType === "image" && file) {
        const signedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signed-url`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { signature, expire, token: imageKitToken } = signedResponse.data;

        const fd = new FormData();
        fd.append("file", file);
        fd.append("fileName", `gallery-${Date.now()}`);
        fd.append("folder", `/Prabhupada_Network/galleries`);
        fd.append("signature", signature);
        fd.append("expire", expire);
        fd.append("token", imageKitToken);
        fd.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);

        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_IMAGEKIT_URL}`,
          fd
        );
        finalUrl = uploadResponse.data.url;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gallery`,
        {
          title,
          mediaType,
          url: finalUrl,
          eventId: eventId || undefined,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const created: GalleryItemData = res.data?.item || {
        _id: res.data?.id || Math.random().toString(36).slice(2),
        title,
        mediaType,
        url: finalUrl,
        uploadedAt: new Date().toISOString(),
      };
      onAdded(created);
      reset();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add to gallery");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={open} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-fontApp">Add to Gallery</h3>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <TextInput
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Select value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="">No Event</option>
            {(typeof window !== "undefined" && (window as any).__events
              ? (window as any).__events
              : []
            ).map((ev: any) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </Select>
          <Select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as any)}
          >
            <option value="image">Image</option>
            <option value="video">YouTube Video</option>
          </Select>
          {mediaType === "image" ? (
            <FileInput
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          ) : (
            <TextInput
              placeholder="YouTube video URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          )}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary2 font-bold hover:bg-primary2/90 rounded-xl"
            >
              {submitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function VideoEmbed({ url }: { url: string }) {
  const id = getYouTubeId(url);
  if (!id) return <div className="aspect-video bg-black rounded-2xl" />;
  return (
    <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-2xl">
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
