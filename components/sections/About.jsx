"use client";

import Image from "next/image";

/* Placeholder content matching HTML mockup files — replaced by Sanity data when available */
const PLACEHOLDER_SERVICES =
  "Event Videography · Brand Campaigns · Commercial Production · Drone & Aerial · Agency Collaboration";

const PLACEHOLDER_TRUSTED_BY =
  "Gin Mare · Diplomatico · Grey Goose · Patrón · JP Chenet · Cantine Maschio";

export default function About({ services = [], trustedBy = [] }) {
  const servicesText =
    services.length > 0
      ? services.map((s) => s.title).join(" · ")
      : PLACEHOLDER_SERVICES;

  const trustedByText =
    trustedBy.length > 0
      ? trustedBy.map((t) => t.name).join(" · ")
      : PLACEHOLDER_TRUSTED_BY;

  return (
    <section id="sec-about">
      {/* Zone A: nav clearance */}
      <div className="zone-top" />

      {/* Zone B: header */}
      <div className="zone-header">
        <h2 className="about-title">Jack Visuals</h2>
      </div>

      {/* Zone C: photo + bio */}
      <div className="zone-main">
        <div className="about-photo">
          <Image
            src="/images/jack-nathan.jpg"
            alt="Nathan of Jack Visuals — cinematic video producer based in Trinidad and Tobago"
            fill
            sizes="(min-width: 768px) 35vw, 40vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
        <div className="about-text-col">
          <p className="about-body">
            With Caribbean roots and a global perspective, Jack brings cultural
            awareness, rhythm and movement into every production.
          </p>
        </div>
      </div>

      {/* Zone D: divider */}
      <div className="zone-divider" />

      {/* Zone E: info blocks */}
      <div className="zone-bottom">
        <div className="about-info-block">
          <div className="about-info-label">What We Offer</div>
          <p className="about-info-sentence">{servicesText}</p>
        </div>
        <div className="about-info-block">
          <div className="about-info-label">Production Kit</div>
          <p className="about-info-sentence">
            Cinema rigs, drone fleet, stabilization systems and on-set
            monitoring — built for every scale.
          </p>
        </div>
        <div className="about-info-block">
          <div className="about-info-label">Trusted By</div>
          <p className="about-info-sentence about-trusted-by">
            {trustedByText}
          </p>
        </div>
      </div>
    </section>
  );
}
