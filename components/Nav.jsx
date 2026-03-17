"use client";

import { useEffect, useState, useCallback } from "react";

const SECTION_IDS = [
  "sec-home",
  "sec-work",
  "sec-about",
  "sec-services",
  "sec-trusted",
  "sec-inquire",
];

const THRESHOLD = 120; // px from section top where nav is visible

export default function Nav() {
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    let showNav = false;

    for (const id of SECTION_IDS) {
      const sec = document.getElementById(id);
      if (!sec) continue;
      const dist = scrollY - sec.offsetTop;
      if (dist >= -10 && dist < THRESHOLD) {
        showNav = true;
        break;
      }
    }

    setVisible(showNav);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToInquire = (e) => {
    e.preventDefault();
    const target = document.getElementById("sec-inquire");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`nav-bar ${visible ? "" : "nav-hidden"}`}
      id="mainNav"
    >
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <svg viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="3"
              width="10"
              height="7"
              rx="1"
              stroke="white"
              strokeWidth="1"
            />
            <polygon points="11,5.5 13,4.5 13,8.5 11,7.5" fill="white" />
            <circle
              cx="4.5"
              cy="6.5"
              r="1.5"
              stroke="white"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>
        </div>
        <div className="nav-logo-text">
          JACK <span>VISUALS</span>
        </div>
      </div>

      <a
        href="#sec-inquire"
        className="nav-inquire"
        onClick={scrollToInquire}
      >
        Inquire
      </a>
    </nav>
  );
}
