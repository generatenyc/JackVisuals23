import { client, servicesQuery, trustedByWithLogosQuery } from "@/lib/sanity";
import AboutPhotoNewLoader from "./AboutPhotoNewLoader";
import "./AboutNew.css";

// SVG icons — stroke white, stroke-width 1, no fill
const IconVideoCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="14" height="11" rx="2" />
    <path d="M16 10l5-3v10l-5-3V10z" />
  </svg>
);

const IconMegaphone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11v2a2 2 0 002 2h1l2 4h2l-1-4h7l2 2V5l-2 2H8L6 9H5a2 2 0 00-2 2z" />
  </svg>
);

const IconClapperboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="13" rx="2" />
    <path d="M2 8l4-5h12l4 5" />
    <path d="M7 3L5 8M12 3v5M17 3l2 5" />
  </svg>
);

const IconDrone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2" />
    <path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="20" cy="4" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
  </svg>
);

const IconHandshake = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
  </svg>
);

const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconGimbal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);

const IconMonitor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const OFFER_ITEMS = [
  { label: "Event Videography", icon: <IconVideoCamera /> },
  { label: "Brand Campaigns", icon: <IconMegaphone /> },
  { label: "Commercial Production", icon: <IconClapperboard /> },
  { label: "Drone & Aerial", icon: <IconDrone /> },
  { label: "Agency Collaboration", icon: <IconHandshake /> },
];

const KIT_ITEMS = [
  { label: "Cinema Rigs", icon: <IconCamera /> },
  { label: "Drone Fleet", icon: <IconDrone /> },
  { label: "Stabilization Systems", icon: <IconGimbal /> },
  { label: "On-Set Monitoring", icon: <IconMonitor /> },
];

export default async function AboutNew() {
  let services = [];
  let trustedBy = [];

  try {
    [services, trustedBy] = await Promise.all([
      client.fetch(servicesQuery, {}, { next: { revalidate: 3600 } }),
      client.fetch(trustedByWithLogosQuery, {}, { next: { revalidate: 3600 } }),
    ]);
  } catch {
    // Sanity unavailable — renders with fallbacks
  }

  // Use Sanity offer items if available, otherwise fall back to static list
  const offerItems =
    services.length > 0
      ? services.map((s, i) => ({
          label: s.title,
          icon: OFFER_ITEMS[i % OFFER_ITEMS.length]?.icon ?? <IconVideoCamera />,
        }))
      : OFFER_ITEMS;

  return (
    <div id="new-about-page">
      <div className="an-inner">
        <section id="new-about-section" className="an-columns">
          {/* Left column: photo animation — sticky 100vh */}
          <div className="an-col-photo">
            <AboutPhotoNewLoader />
          </div>

          {/* Right column: title + bio + info blocks */}
          <div className="an-col-right">
            <h2 className="an-title">Jack Visuals</h2>
            <p className="an-bio an-bio--debug">
              Jack Visuals is a cinematic video production studio based in Trinidad &amp; Tobago,
              delivering premium content for luxury brands, live events, and creative agencies.
              From aerial footage to high-end brand films, every frame is crafted with intention.
            </p>

            {/* What We Offer */}
            <div className="an-info-block an-info-block--debug-offer">
              <p className="an-info-label">What We Offer</p>
              <div className="an-icon-grid">
                {offerItems.map((item) => (
                  <div key={item.label} className="an-icon-card">
                    {item.icon}
                    <span className="an-icon-card-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Kit */}
            <div className="an-info-block an-info-block--debug-kit">
              <p className="an-info-label">Production Kit</p>
              <div className="an-icon-grid">
                {KIT_ITEMS.map((item) => (
                  <div key={item.label} className="an-icon-card">
                    {item.icon}
                    <span className="an-icon-card-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trusted By — debug border: remove once confirmed rendering */}
            <div className="an-info-block an-info-block--debug">
              <p className="an-info-label">Trusted By</p>
              {trustedBy.length > 0 ? (
                <div className="an-logo-grid">
                  {trustedBy.map((brand) => (
                    <div key={brand.name} className="an-logo-cell">
                      {brand.logo?.asset?.url ? (
                        <img
                          src={brand.logo.asset.url}
                          alt={brand.name}
                          loading="lazy"
                        />
                      ) : (
                        <span className="an-logo-text-fallback">{brand.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="an-logo-grid">
                  {["Gin Mare", "Diplomatico", "Grey Goose", "Patrón", "JP Chenet", "Cantine Maschio"].map((name) => (
                    <div key={name} className="an-logo-cell">
                      <span className="an-logo-text-fallback">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );

}
