import "../styles/globals.css";
import StructuredData from "@/components/StructuredData";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: {
    default: "Jack Visuals — Cinematic Video Production | Trinidad & Tobago",
    template: "%s — Jack Visuals",
  },
  description:
    "Cinematic video production company based in Trinidad and Tobago. Brand films, event coverage, and commercial video for the Caribbean region.",
  keywords: [
    "video production Trinidad",
    "cinematic videographer Trinidad and Tobago",
    "brand video Caribbean",
    "event videographer Port of Spain",
  ],
  authors: [{ name: "Jack Visuals" }],
  openGraph: {
    title: "Jack Visuals — Cinematic Video Production | Trinidad & Tobago",
    description:
      "Brand films, event coverage, and commercial video production based in Trinidad and Tobago.",
    url: "https://jackvisuals23.com",
    siteName: "Jack Visuals",
    locale: "en_TT",
    type: "website",
    images: [
      {
        url: "https://jackvisuals23.com/images/og-cover.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jack Visuals — Cinematic Video Production",
    description:
      "Brand films, event coverage, and commercial video in Trinidad & Tobago.",
    images: ["https://jackvisuals23.com/images/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://jackvisuals23.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
