"use client";

// Razorpay typings (client-only)
declare global {
  interface Window {
    Razorpay?: any;
  }
}
const RZP_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""; // ⬅️ set in your .env

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DONOR_TIERS } from "../data";

// --- THEME ---
// Uses your project's palette:
// Peacock Blue #004D40, Bright Orange #FF5722, Lotus Pink #FF69B4, White #FFFFFF
// Tailwind classes below assume those colors exist (fallbacks provided).

type Amount = 200 | 500 | 1000 | 2100 | 5100 | 11000;

const PRESET_AMOUNTS: Amount[] = [200, 500, 1000, 2100, 5100, 11000];

// NOTE: Fill these from the official page once confirmed.
// I left placeholders so you can copy-paste the exact values.
const BANK_DETAILS = {
  accountName: "Iskcon",
  bankName: "ICICI",
  accountNumber: "402401000048",
  ifsc: "ICIC0004024",
  branch: "BAMON PUKUR",
  swift: "<SWIFT, if applicable>",
};

const UPI_DETAILS = {
  upiId: "SriMayapurFestival5@icici",
  qrSrc:
    "https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SPCM_QR.png?updatedAt=1755004467983", // place a QR image at public/images/donate-qr.png
};

export default function DonatePage() {
  const [amount, setAmount] = useState<number | "">(1000);
  const [isRecurring, setIsRecurring] = useState(false);
  const [method, setMethod] = useState<"upi" | "gateway" | "bank">("upi");
  const [donor, setDonor] = useState({ name: "", email: "", phone: "" });
  const [isDesktop, setIsDesktop] = useState(false);

  const [scriptReady, setScriptReady] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const razorpayScriptRef = useRef<HTMLScriptElement | null>(null);

  const donateCardRef = useRef<HTMLDivElement | null>(null);
  const jumpToDonate = (amt?: number) => {
    if (typeof amt === "number") setAmount(amt);
    donateCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const isValid = useMemo(() => {
    return Number(amount) > 0 && donor.name.trim() && /@/.test(donor.email);
  }, [amount, donor]);

  const handleSelect = (val: number) => setAmount(val);

  const handleSubmit = () => {
    // Wire this to your backend/gateway.
    // For now we just log the intent.
    console.log({ amount, isRecurring, method, donor });
    alert("Kindly do a direct bank transfer to the account mentioned there and please share the screenshot and address details with us at srilaprabhupadaconnectionm@gmail.com for creating receipt and 80G certificate, We appreciate for your Support");
  };

  // Build a cross‑app UPI intent link
  const upiDeepLink = (
    vpa: string,
    payeeName: string,
    amt: number,
    note = "Donation"
  ) => {
    const params = new URLSearchParams({
      pa: vpa, // payee VPA
      pn: payeeName,
      am: String(amt),
      cu: "INR",
      tn: note,
    });
    return `upi://pay?${params.toString()}`;
  };

  // Open Razorpay Checkout (client‑only quick integration)
  const payWithRazorpay = () => {
    if (!RZP_KEY) {
      alert(
        "Payment gateway key missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your environment."
      );
      return;
    }
    if (!scriptReady || !window.Razorpay) {
      alert("Payment module is still loading. Please try again in a moment.");
      return;
    }
    if (!isValid) return;
    setPayLoading(true);

    const rzp = new window.Razorpay({
      key: RZP_KEY,
      amount: Math.round(Number(amount) * 100), // paise
      currency: "INR",
      name: "Srila Prabhupada Connection-Mayapur",
      description: isRecurring
        ? "Recurring donation (first charge)"
        : "One‑time donation",
      // order_id: "", // Optional: set from your server for signature verification
      prefill: {
        name: donor.name,
        email: donor.email,
        contact: donor.phone,
      },
      notes: {
        source: "donations_page",
        recurring: String(isRecurring),
      },
      theme: { color: "#FF5722" },
      handler: function (_response: any) {
        // TODO: send response to backend for verification & receipt issuance
        alert(
          "Thank you! Your payment was initiated. You will receive a receipt by email shortly."
        );
        setPayLoading(false);
      },
      modal: {
        ondismiss: function () {
          setPayLoading(false);
        },
      },
    });
    rzp.open();
  };

  useEffect(() => {
    // Only runs on client
    setIsDesktop(window.innerWidth > 1024);
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Load Razorpay script only on client
    if (razorpayScriptRef.current || typeof window === "undefined") return;
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => setScriptReady(true);
    s.onerror = () => setScriptReady(false);
    document.body.appendChild(s);
    razorpayScriptRef.current = s;
  }, []);

  return (
    <main className="min-h-screen mt-4">
      <section className="flex items-center relative isolate h-auto w-auto lg:h-72 overflow-hidden rounded-2xl">
        {/* Background image of Srila Prabhupada */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {isDesktop && (
          <img
            src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SP_DI.jpg?updatedAt=1754991158916"
            alt="Śrīla Prabhupāda with Śrīmad-Bhāgavatam"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[0_25%] opacity-90"
          />
        )}
        {/* Gradient overlays (match site palette) */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#004D40]/85 via-[#004D40]/40 to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="mx-auto max-w-7xl px-2 lg:px-6 py-2 lg:py-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Quote card */}
            <div className="max-w-2xl rounded-3xl border border-white/20 bg-white/70 backdrop-blur p-2 sm:p-4 shadow-xl">
              <span className="inline-flex items-center rounded-full bg-[#FF5722]/10 text-[#FF5722] px-3 py-1 text-xs font-semibold">
                Donate to spread bhakti
              </span>
              <p className="mt-4 text-xl sm:text-2xl font-bold leading-snug text-[#034242]">
                Charity given to spread Krishna consciousness is the greatest
                charity in the world.
              </p>
              <p className="mt-2 flex justify-end text-sm text-[#034242]/80">
                — Śrīla A. C. Bhaktivedanta Swami Prabhupāda
              </p>
              <div className="mt-6 flex justify-center flex-wrap gap-3">
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-[#FF5722] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95"
                  onClick={() => jumpToDonate()}
                >
                  Donate now
                </button>
                <button
                  onClick={() => jumpToDonate(2100)}
                  className="inline-flex items-center justify-center rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-[#034242] border border-[#004D40]/20 hover:bg-white"
                >
                  Give ₹2,100
                </button>
              </div>
            </div>

            {/* Right column intentionally empty to let your donate card stay visible above-the-fold on large screens */}
            {/* <div className="hidden lg:block" /> */}
          </div>
        </div>
      </section>
      {/* Donation Card */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10 bg-[radial-gradient(600px_300px_at_20%_20%,#FF69B4,transparent),radial-gradient(600px_300px_at_80%_0%,#004D40,transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-[#004D40]/10 text-[#004D40] px-3 py-1 text-xs font-semibold">
                Support the Srila Prabhupada Connection - Mayapur
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-[#034242]">
                Your Donation fuels seva, education & outreach
              </h1>
              <p className="mt-4 text-lg text-[#034242]/80">
                Help us preserve and spread Srila Prabhupada’s
                teachings—kirtans, classes, prasadam distribution, books, and
                digital content that reaches seekers worldwide.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-[#034242]/70">
                <li>• 100% secure payments</li>
                <li>• Receipts provided for every donation</li>
                <li>• Bank Transfer • UPI • Payment Gateway</li>
              </ul>
            </div>

            {/* Donate Card */}
            <div
              ref={donateCardRef}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-black/5 p-6 sm:p-8"
            >
              <h2 id="donate" className="text-xl font-semibold text-[#034242]">
                Donate now
              </h2>

              {/* Amount Pills */}
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => handleSelect(a)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      amount === a
                        ? "bg-[#FF5722] text-white border-[#FF5722] shadow"
                        : "bg-white text-[#034242] border-[#004D40]/20 hover:border-[#FF5722]"
                    }`}
                    aria-pressed={amount === a}
                  >
                    ₹{a.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-[#034242]"
                >
                  Custom amount (₹)
                </label>
                <input
                  id="amount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-[#004D40]/20 bg-white px-4 py-3 text-[#034242] focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  placeholder="e.g., 2100"
                />
              </div>

              {/* Recurring Toggle */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#034242]">
                  Make this a monthly donation
                </span>
                <button
                  type="button"
                  onClick={() => setIsRecurring((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    isRecurring ? "bg-[#004D40]" : "bg-gray-300"
                  }`}
                  aria-pressed={isRecurring}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                      isRecurring ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Donor info */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  aria-label="Your name"
                  placeholder="Your name"
                  className="rounded-xl border border-[#004D40]/20 bg-white px-4 py-3 text-[#034242] focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  value={donor.name}
                  onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                />
                <input
                  aria-label="Email"
                  placeholder="Email"
                  type="email"
                  className="rounded-xl border border-[#004D40]/20 bg-white px-4 py-3 text-[#034242] focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  value={donor.email}
                  onChange={(e) =>
                    setDonor({ ...donor, email: e.target.value })
                  }
                />
                <input
                  aria-label="Phone"
                  placeholder="Phone"
                  className="rounded-xl border border-[#004D40]/20 bg-white px-4 py-3 text-[#034242] focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                  value={donor.phone}
                  onChange={(e) =>
                    setDonor({ ...donor, phone: e.target.value })
                  }
                />
              </div>

              {/* Payment Method Tabs */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm">
                  {(
                    [
                      { key: "upi", label: "UPI" },
                      { key: "gateway", label: "Card/NetBanking" },
                      { key: "bank", label: "Bank Transfer" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setMethod(tab.key)}
                      className={`rounded-full px-4 py-2 border text-sm font-semibold transition ${
                        method === tab.key
                          ? "bg-[#004D40] text-white border-[#004D40]"
                          : "bg-white text-[#034242] border-[#004D40]/20 hover:border-[#FF5722]"
                      }`}
                      aria-pressed={method === tab.key}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {method === "upi" && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-2">
                      <p className="text-sm text-[#034242]/80">
                        Send to UPI ID
                      </p>
                      <div className="flex items-center justify-between rounded-xl border border-[#004D40]/20 bg-white px-4 py-3">
                        <span className="font-semibold text-[#034242]">
                          {UPI_DETAILS.upiId}
                        </span>
                        <button
                          onClick={() => {
                            if (
                              typeof navigator !== "undefined" &&
                              navigator.clipboard &&
                              navigator.clipboard.writeText
                            ) {
                              navigator.clipboard.writeText(UPI_DETAILS.upiId);
                            } else {
                              // fallback: select the text or show a message
                              alert(
                                "Copy not supported in this browser. Please copy manually."
                              );
                            }
                          }}
                          className="text-xs font-semibold text-[#FF5722] hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-xs text-[#034242]/60">
                        Scan the QR or pay to the UPI ID and share the receipt
                        with us to receive an acknowledgement.
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={UPI_DETAILS.qrSrc}
                        alt="UPI QR for donation"
                        className="h-48 w-48 rounded-xl border border-[#004D40]/10 bg-white p-2 shadow-sm object-contain"
                      />
                      <a
                        href={
                          typeof amount === "number"
                            ? upiDeepLink(
                                UPI_DETAILS.upiId,
                                "Srila Prabhupada Connection - Mayapur",
                                amount,
                                "Donation"
                              )
                            : "#"
                        }
                        onClick={(e) => {
                          if (typeof amount !== "number") e.preventDefault();
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-[#004D40] px-4 py-2 text-white text-sm font-semibold hover:opacity-95"
                      >
                        Pay with UPI App
                      </a>
                      <p className="text-[11px] text-[#034242]/60 text-center">
                        Opens your UPI app with details prefilled. Works best on
                        Android (GPay/PhonePe/Paytm).
                      </p>
                    </div>
                  </div>
                )}

                {method === "gateway" && (
                  <div className="mt-4 rounded-xl border border-dashed border-[#004D40]/30 bg-white p-4 text-sm text-[#034242]/80">
                    <p className="font-medium">
                      Card / NetBanking / UPI (via Razorpay)
                    </p>
                    <p className="mt-1">
                      Secure checkout opens in a popup. Amount and your details
                      are prefilled.
                    </p>
                    <button
                      disabled={!isValid || payLoading}
                      onClick={()=>alert("At this moment we are not supporting card payments, kindly UPI or do a bank transfer")}
                      className={`mt-3 inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white shadow transition ${
                        isValid && !payLoading
                          ? "bg-[#FF5722] hover:opacity-90"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {payLoading
                        ? "Opening Checkout…"
                        : `Pay ₹${Number(amount).toLocaleString("en-IN")}`}
                    </button>
                    {!RZP_KEY && (
                      <p className="mt-2 text-xs text-red-600">
                        Env missing: set{" "}
                        <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to enable
                        payments.
                      </p>
                    )}
                  </div>
                )}

                {method === "bank" && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-[#034242]/80">
                        Transfer to our bank account
                      </p>
                      <div className="rounded-xl border border-[#004D40]/20 bg-white p-4 text-sm">
                        <Detail
                          label="Account Name"
                          value={BANK_DETAILS.accountName}
                        />
                        <Detail
                          label="Bank Name"
                          value={BANK_DETAILS.bankName}
                        />
                        <Detail
                          label="Account Number"
                          value={BANK_DETAILS.accountNumber}
                        />
                        <Detail label="IFSC" value={BANK_DETAILS.ifsc} />
                        {BANK_DETAILS.branch && (
                          <Detail label="Branch" value={BANK_DETAILS.branch} />
                        )}
                        {BANK_DETAILS.swift && (
                          <Detail label="SWIFT" value={BANK_DETAILS.swift} />
                        )}
                      </div>
                      <p className="text-xs text-[#034242]/60">
                        After the transfer, please email or whatsapp your transaction UTR
                        and contact details to receive a receipt. You will
                        receive an acknowledgement within 24–48 hours.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-[#004D40] to-[#59B2B2] p-6 text-white">
                      <p className="text-lg font-semibold">
                        Why your help matters
                      </p>
                      <ul className="mt-3 space-y-2 text-sm/6">
                        <li>• Daily kirtans & classes recording</li>
                        <li>• Book distribution & prasadam</li>
                        <li>• Youth outreach & digital seva</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => {
                  if (method === "gateway") return alert("At this moment we are not supporting card payments, kindly UPI or do a bank transfer");
                  if (method === "upi")
                    return alert(
                      "Use the UPI button above or scan the QR to complete payment."
                    );
                  return handleSubmit();
                }}
                disabled={!isValid}
                className={`mt-6 w-full rounded-2xl px-6 py-4 text-center font-semibold text-white shadow-lg transition ${
                  isValid
                    ? "bg-[#FF5722] hover:opacity-95"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Donate ₹{Number(amount || 0).toLocaleString("en-IN")}
                {isRecurring ? " monthly" : " one-time"}
              </button>

              <p className="mt-3 text-center text-xs text-[#034242]/60">
                By donating you agree to our terms. Receipts will be sent to
                your email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME / INTRO */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-10">
        <div className="rounded-3xl border border-[#004D40]/10 bg-white/70 backdrop-blur p-6 sm:p-10 shadow-sm">
          <h2 className="text-3xl font-bold text-[#034242]">
            Welcome to Our Srila Prabhupada Connection - Mayapur
          </h2>
          <p className="mt-4 text-[#034242]/80">
            Thank you for visiting our donation page. Your generous contribution
            helps us spread the teachings of Krishna consciousness and support
            those on their spiritual journey. Together, we can make a difference
            by nurturing the souls who seek the divine path and creating a world
            filled with love, peace, and devotion.
          </p>
          <p className="mt-3 text-[#034242]/80">
            By donating, you are not just offering financial support—you are
            participating in a sacred mission to bring others closer to the
            infinite grace of Lord Krishna. Every contribution, no matter the
            size, is a step towards spiritual enlightenment for all.
          </p>
          <p className="mt-3 text-[#034242]/80">
            May Krishna bless you abundantly for your kindness and devotion.
          </p>
        </div>
      </section>

      {/* SPECIFIC WAYS */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6">
        <h3 className="text-2xl font-bold text-[#034242]">
          Specific Ways You Can Help and the Benefits
        </h3>
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-[#004D40]/10 bg-white p-6 shadow-sm">
            <blockquote className="text-sm sm:text-base italic text-[#034242]/80 border-l-4 pl-4 border-[#FF69B4]">
              Śrīla Prabhupāda often quotes from the Padma Purāṇa: “Above the
              worship of Lord Viṣṇu is the rendering of service to Vaiṣṇavas….”
            </blockquote>
            <p className="mt-4 text-sm sm:text-base text-[#034242]/80">
              The Srila Prabhupada Connection - Mayapur is all about Vaiṣṇava
              sevā by focusing on serving the greatest of all Vaiṣṇavas, Śrīla
              Prabhupāda:
            </p>
            <ul className="mt-3 space-y-2 text-sm sm:text-base text-[#034242]/80">
              <li>
                ➔ We are trying our best to strengthen his mission by deepening
                our relationships with him so that we can access his śakti,
                which is imbued with loving compassion.
              </li>
              <li>
                ➔ One of the best ways to deepen our relationship with him is by
                engaging in the six loving exchanges described in Upadeśāmṛta:
                “Offering gifts in charity, accepting charitable gifts,
                revealing one’s mind in confidence, inquiring confidentially,
                accepting prasāda and offering prasāda are the six symptoms of
                love shared by one devotee and another.”
              </li>
              <li className="text-xs sm:text-sm text-[#034242]/60">
                We read in the purport: “…simply by reciprocating in these six
                ways, an ordinary man can fully revive his dormant Kṛṣṇa
                consciousness.”
              </li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[#004D40]/10 bg-white p-6 shadow-sm">
            <p className="text-sm sm:text-base text-[#034242]/80">
              Śrīla Prabhupāda spread Kṛṣṇa consciousness worldwide with these
              loving exchanges, and our initiative emphasizes them with
              expenditures supporting:
            </p>
            <ul className="mt-3 space-y-2 text-sm sm:text-base text-[#034242]/80">
              <li>➔ Prasādam distribution.</li>
              <li>
                ➔ Gifts to local schoolchildren for transcendental competitions
                that deepen their appreciation of Śrīla Prabhupāda.
              </li>
              <li>
                ➔ Devotee care—revealing one’s mind in confidence and inquiring
                confidentially.
              </li>
              <li>
                ➔ Śrīla Prabhupāda Connect Days focused on these exchanges.
              </li>
              <li>
                ➔ Our Śrīla Prabhupāda Introductory Course with student‑centered
                learning that frequently engages these exchanges.
              </li>
            </ul>
            <p className="mt-4 text-sm sm:text-base text-[#034242]/80">
              By donating with love, you will receive Kṛṣṇa’s blissful
              reciprocation for significant Vaiṣṇava sevā, accelerate your
              spiritual development, and deepen your loving relationships with
              Śrīla Prabhupāda and your dīkṣā‑guru.
            </p>
          </article>
        </div>
      </section>

      {/* DONOR TIERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-2xl font-bold text-[#034242]">
            Srila Prabhupada Connection - Mayapur Donor Reciprocation
          </h3>
          <button
            onClick={() => jumpToDonate()}
            className="rounded-full bg-[#FF5722] px-4 py-2 text-white text-sm font-semibold shadow hover:opacity-95"
          >
            Donate any amount
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DONOR_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col justify-between rounded-2xl border border-[#004D40]/10 bg-white shadow-sm p-6"
            >
              <div>
                <p className="text-lg font-bold text-[#004D40]">{tier.name}</p>
                <p className="mt-1 text-2xl font-extrabold text-[#034242]">
                  {tier.amount}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#034242]/80">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => jumpToDonate(tier.numericAmount)}
                className="mt-5 w-full rounded-xl bg-[#004D40] px-4 py-3 text-white font-semibold hover:opacity-95"
              >
                Donate Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT + TRUST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* <div className="grid lg:grid-cols-3 gap-6">
          {[
            { k: "+2M", t: "Digital reach across platforms" },
            { k: "500+", t: "Books distributed last year" },
            { k: "100K+", t: "Plates of prasadam served" },
          ].map((s) => (
            <div
              key={s.t}
              className="rounded-2xl border border-[#004D40]/10 bg-white p-6 shadow-sm"
            >
              <p className="text-3xl font-extrabold text-[#004D40]">{s.k}</p>
              <p className="mt-1 text-sm text-[#034242]/80">{s.t}</p>
            </div>
          ))}
        </div> */}

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#034242]/70">
          <span className="rounded-full bg-white border border-[#004D40]/10 px-3 py-1">
            SSL Secured
          </span>
          <span className="rounded-full bg-white border border-[#004D40]/10 px-3 py-1">
            Official Account
          </span>
          <span className="rounded-full bg-white border border-[#004D40]/10 px-3 py-1">
            Receipts for all donations
          </span>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-24">
        <h3 className="text-2xl font-bold text-[#034242]">
          Frequently asked questions
        </h3>
        <div className="mt-6 space-y-4">
          <Faq
            q="Will I get a receipt for my donation?"
            a="Yes. Please ensure your email is correct; we send receipts for every successful donation."
          />
          <Faq
            q="Can I donate from outside India?"
            a="Yes, via payment gateway or SWIFT (if enabled). For bank transfers, please write to us for current details."
          />
          <Faq
            q="Is my donation tax-deductible?"
            a="If applicable, we will mention the section (e.g., 80G) here. Please confirm with us for the latest status."
          />
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-[#004D40]/10 py-2">
      <span className="text-[#034242]/70">{label}</span>
      <span className="font-semibold text-[#034242]">{value || "—"}</span>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[#004D40]/10 bg-white p-4">
      <button
        className="w-full text-left flex items-center justify-between gap-4"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-[#034242]">{q}</span>
        <span
          className={`transition duration-300 ease-in-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ⌄
        </span>
      </button>
      {open && <p className="mt-3 text-sm text-[#034242]/80 transition duration-300 ease-in-out">{a}</p>}
    </div>
  );
}
