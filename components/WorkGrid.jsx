"use client";

import { useState, useCallback, useEffect } from "react";

const FILTERS = ["All", "Events", "Brand", "Commercial", "Drone"];

/* Placeholder projects shown when Sanity has no data */
const PLACEHOLDER_PROJECTS = [
  { _id: "ph-1", title: "Trinidad Carnival 2024", category: "Events" },
  { _id: "ph-2", title: "Grey Goose Campaign", category: "Brand" },
  { _id: "ph-3", title: "Coastal Estates", category: "Drone" },
  { _id: "ph-4", title: "Restaurant Launch Film", category: "Commercial" },
  { _id: "ph-5", title: "Carnival Road Recap", category: "Events" },
  { _id: "ph-6", title: "Patrón Mixology Series", category: "Brand" },
];

const BG_CLASSES = ["wp-bg-1", "wp-bg-2", "wp-bg-3"];

/**
 * Convert a Vimeo URL to an embed URL.
 * e.g. "https://vimeo.com/123456789" → "https://player.vimeo.com/video/123456789?autoplay=1..."
 */
function getVimeoEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0`;
}

export default function WorkGrid({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const cards = projects.length > 0 ? projects : PLACEHOLDER_PROJECTS;

  const filtered =
    activeFilter === "All"
      ? cards
      : cards.filter(
          (c) => c.category?.toLowerCase() === activeFilter.toLowerCase()
        );

  const handlePlay = useCallback((vimeoUrl) => {
    const embedUrl = getVimeoEmbedUrl(vimeoUrl);
    if (embedUrl) setLightboxUrl(embedUrl);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxUrl(null);
  }, []);

  /* Close lightbox on Escape key */
  useEffect(() => {
    if (!lightboxUrl) return;
    const handleKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxUrl, closeLightbox]);

  return (
    <>
      {/* Filter tabs */}
      <div className="wp-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`wp-filter-tab${activeFilter === f ? " wp-filter-active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Card grid or empty state */}
      {filtered.length === 0 ? (
        <div className="wp-empty">No projects in this category yet.</div>
      ) : (
        <div className="wp-grid">
          {filtered.map((card, i) => (
            <div key={card._id} className="wp-card">
              <div className={`wp-card-bg ${BG_CLASSES[i % 3]}`} />

              {/* Tag — always visible */}
              <div className="wp-card-tag">{card.category?.toUpperCase()}</div>

              {/* Gradient overlay + info */}
              <div className="wp-card-overlay" />
              <div className="wp-card-info">
                <div className="wp-card-cat">{card.category}</div>
                <div className="wp-card-title">{card.title}</div>
              </div>

              {/* Play button — opens Vimeo lightbox when vimeoUrl exists */}
              <button
                className="wp-card-play"
                aria-label={`Play ${card.title}`}
                onClick={() => handlePlay(card.vimeoUrl)}
              >
                <svg viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Vimeo lightbox */}
      {lightboxUrl && (
        <div className="wp-lightbox" onClick={closeLightbox}>
          <div
            className="wp-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={lightboxUrl}
              className="wp-lightbox-iframe"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Project video"
            />
            <button
              className="wp-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close video"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
