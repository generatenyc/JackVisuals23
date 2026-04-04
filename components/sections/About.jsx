"use client";

import dynamic from "next/dynamic";
import "./About.css";

const AboutPhoto = dynamic(() => import("./AboutPhoto"), {
  ssr: false,
  loading: () => (
    <div className="about-photo" style={{ background: "#000", position: "relative" }} />
  ),
});

/* Placeholder content matching HTML mockup files — replaced by Sanity data when available */
const PLACEHOLDER_SERVICES =
  "Event Videography · Brand Campaigns · Commercial Production · Drone & Aerial · Agency Collaboration";

const PLACEHOLDER_PRODUCTION_KIT =
  "Cinema rigs, drone fleet, stabilization systems and on-set monitoring — built for every scale.";

const LOGO_MAP = {
  "Gin Mare":        "/images/logos/gin-mare.png",
  "Diplomatico":     "/images/logos/diplomatico.png",
  "Grey Goose":      "/images/logos/grey-goose.png",
  "Patrón":          "/images/logos/patron.png",
  "JP Chenet":       "/images/logos/jp-chenet.png",
  "Cantine Maschio": "/images/logos/cantine-maschio.png",
  "Carnival Tribe":  "/images/logos/tribe.png",
};

const PLACEHOLDER_LOGOS = Object.keys(LOGO_MAP).map((name) => ({ name }));

export default function About({
  services = [],
  trustedBy = [],
  productionKit = null,
}) {
  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  const logoList = trustedBy.length > 0 ? trustedBy : PLACEHOLDER_LOGOS;
  const logoSizeClass =
    logoList.length <= 4 ? "logo-grid--lg"
    : logoList.length <= 8 ? "logo-grid--md"
    : "logo-grid--sm";

  const productionKitText =
    productionKit?.description || PLACEHOLDER_PRODUCTION_KIT;

  return (
    <section id="sec-about">
      {/* Nav clearance */}
      <div className="zone-top" />

      {/* Header */}
      <div className="zone-header">
        <h2 className="about-title">Jack Visuals</h2>
      </div>

      {/* Two-column content: text left, photo right */}
      <div className="about-content">
        <div className="about-left">
          <p className="about-body">
            With Caribbean roots and a global perspective, Jack brings cultural
            awareness, rhythm and movement into every production. From intimate
            brand stories to large-scale live events, his work is defined by
            precision, emotion, and cinematic detail. Based in Trinidad and
            Tobago, Jack Visuals operates across the Caribbean and beyond.
          </p>
          <div className="about-info-block">
            <div className="about-info-label">What We Offer</div>
            <p className="about-info-sentence">{servicesText}</p>
          </div>
          <div className="about-info-block">
            <div className="about-info-label">Production Kit</div>
            <p className="about-info-sentence">{productionKitText}</p>
          </div>
          <div className="about-info-block">
            <div className="about-info-label">Trusted By</div>
            <div className={`about-logo-grid ${logoSizeClass}`}>
              {logoList.map((brand, i) =>
                LOGO_MAP[brand.name] ? (
                  <div
                    key={brand.name}
                    className="about-logo-cell"
                    style={{ "--i": i }}
                  >
                    <img
                      src={LOGO_MAP[brand.name]}
                      alt={brand.name}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    key={brand.name}
                    className="about-logo-cell"
                    style={{ "--i": i }}
                  >
                    <span className="about-logo-text-fallback">{brand.name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Photo zone — client-only, never server-rendered */}
        <AboutPhoto />
      </div>
    </section>
  );
}
