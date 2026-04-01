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

const PLACEHOLDER_TRUSTED_BY =
  "Gin Mare · Diplomatico · Grey Goose · Patrón · JP Chenet · Cantine Maschio";

const PLACEHOLDER_PRODUCTION_KIT =
  "Cinema rigs, drone fleet, stabilization systems and on-set monitoring — built for every scale.";

export default function About({
  services = [],
  trustedBy = [],
  productionKit = null,
}) {
  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  const trustedByText =
    trustedBy.length > 0
      ? trustedBy.map((t) => t.name).join(" · ")
      : PLACEHOLDER_TRUSTED_BY;

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
            <p className="about-info-sentence about-trusted-by">
              {trustedByText}
            </p>
          </div>
        </div>

        {/* Photo zone — client-only, never server-rendered */}
        <AboutPhoto />
      </div>
    </section>
  );
}
