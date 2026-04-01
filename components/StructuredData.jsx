export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Jack Visuals",
    description:
      "Cinematic video production company based in Trinidad and Tobago. Specializing in brand films, event coverage, and commercial video.",
    url: "https://jackvisuals23.com",
    logo: "https://jackvisuals23.com/images/jack-visuals-logo.png",
    image: "https://jackvisuals23.com/images/og-cover.jpg",
    email: "nathan@rjaonline.com",
    sameAs: [
      "https://instagram.com/jackvisuals23",
      "https://vimeo.com/jackvisuals",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TT",
      addressRegion: "Trinidad and Tobago",
    },
    areaServed: ["Trinidad and Tobago", "Caribbean"],
    serviceType: [
      "Brand Film Production",
      "Event Videography",
      "Commercial Video Production",
      "Music Video Production",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
