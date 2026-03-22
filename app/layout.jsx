import "../styles/globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: {
    default: "Jack Visuals — Cinematic Video Production | Trinidad & Tobago",
    template: "%s — Jack Visuals",
  },
  description:
    "Cinematic video production company based in Trinidad and Tobago. Brand films, event coverage, and commercial video for the Caribbean region.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
