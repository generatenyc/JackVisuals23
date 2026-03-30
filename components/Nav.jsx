"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = [
  "sec-home",
  "sec-work",
  "sec-about",
  "sec-inquire",
];

const THRESHOLD = 120; // px from section top where nav is visible

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    let showNav = false;
    let foundAnySection = false;

    for (const id of SECTION_IDS) {
      const sec = document.getElementById(id);
      if (!sec) continue;
      foundAnySection = true;
      const dist = scrollY - sec.offsetTop;
      if (dist >= -10 && dist < THRESHOLD) {
        showNav = true;
        break;
      }
    }

    // If no tracked sections exist (e.g. /work page), always show nav
    setVisible(foundAnySection ? showNav : true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleInquireClick = (e) => {
    if (isHome) {
      e.preventDefault();
      const target = document.getElementById("sec-inquire");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    // On non-home pages, let the browser navigate to /#sec-inquire
  };

  return (
    <nav
      className={`nav-bar ${visible ? "" : "nav-hidden"}`}
      id="mainNav"
    >
      <div className="nav-logo">
        <img
          src="/images/jack-visuals-whitelogo.jpeg"
          alt="Jack Visuals"
          className="nav-logo-img"
        />
        <span className="nav-logo-text">JACK VISUALS</span>
      </div>

      <a
        href={isHome ? "#sec-inquire" : "/#sec-inquire"}
        className="nav-inquire"
        onClick={handleInquireClick}
      >
        Inquire
      </a>
    </nav>
  );
}
