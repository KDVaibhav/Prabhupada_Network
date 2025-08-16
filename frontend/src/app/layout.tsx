import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./Providers";
import ContactUsSection from "@/components/ContactUsSection";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Srila Prabhupada Connection - ISKCON Mayapur | Teachings & Events",
  description:
    "Official Srila Prabhupada Connection for ISKCON Mayapur — Founder Acharya of the International Society for Krishna Consciousness. Explore teachings, events, and galleries.",
  openGraph: {
    title: "Srila Prabhupada Connection - ISKCON Mayapur",
    description:
      "Founder Acharya of ISKCON. Explore Srila Prabhupada's teachings, events, and galleries.",
    url: "https://www.srilaprabhupadaconnection-mayapur.com",
    siteName: "Srila Prabhupada Connection - ISKCON Mayapur",
    images: [
      {
        url: "https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SPCM_Logo.jpg?updatedAt=1755154940572",
        width: 1200,
        height: 630,
        alt: "Srila Prabhupada",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Srila Prabhupada Connection - ISKCON Mayapur",
    description:
      "Founder Acharya of ISKCON. Explore Srila Prabhupada's teachings, events, and galleries.",
    images: [
      "https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SPCM_Logo.jpg?updatedAt=1755154940572",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="gJLpUITUyEyAeTTf0FLNzWdtPk6JFWpEsD8IBzYZQPc"
        />
        <link
          rel="canonical"
          href="https://www.srilaprabhupadaconnection-mayapur.com"
        />
        <meta
          property="og:title"
          content="Srila Prabhupada Connection - ISKCON Mayapur"
        />
        <meta
          property="og:description"
          content="Founder Acharya of ISKCON. Explore Srila Prabhupada's teachings, events, and galleries."
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SPCM_Logo.jpg?updatedAt=1755154940572"
        />
        <meta
          property="og:url"
          content="https://www.srilaprabhupadaconnection-mayapur.com"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Srila Prabhupada Connection - ISKCON Mayapur"
        />
        <meta
          name="twitter:description"
          content="Founder Acharya of ISKCON. Explore Srila Prabhupada's teachings, events, and galleries."
        />
        <meta
          name="twitter:image"
          content="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SPCM_Logo.jpg?updatedAt=1755154940572"
        />
        {/* ✅ Structured Data for Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Srila Prabhupada Connection - ISKCON Mayapur",
              url: "https://www.srilaprabhupadaconnection-mayapur.com",
              logo: "https://www.srilaprabhupadaconnection-mayapur.com/logo.png",
              sameAs: [
                // "https://facebook.com/yourpage",
                // "https://instagram.com/yourpage",
                // "https://youtube.com/yourchannel",
              ],
            }),
          }}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`px-2 md:px-20 pt-5 bg-bgApp ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <ContactUsSection />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
