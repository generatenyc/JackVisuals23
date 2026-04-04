"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = [
  "sec-home",
  "sec-work",
  "sec-about",
  "sec-inquire",
];

const NAV_LINKS = [
  { label: "Work",    id: "sec-work" },
  { label: "About",   id: "sec-about" },
  { label: "Inquire", id: "sec-inquire" },
];

const THRESHOLD = 120; // px from section top where nav is visible

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (e, sectionId) => {
    setMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const target = document.getElementById(sectionId);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
    // On non-home pages, navigate to /#sectionId
  };

  return (
    <>
      <nav
        className={`nav-bar ${visible ? "" : "nav-hidden"}`}
        id="mainNav"
      >
        {/* Logo */}
        <a
          href={isHome ? "#sec-home" : "/"}
          className="nav-logo"
          onClick={(e) => isHome && (e.preventDefault(), document.getElementById("sec-home")?.scrollIntoView({ behavior: "smooth" }))}
        >
          <img
            src="/images/jack-visuals-whitelogo.jpeg"
            alt="Jack Visuals"
            className="nav-logo-img"
          />
        </a>

        {/* Desktop links */}
        <div className="nav-desktop-links">
          {NAV_LINKS.map(({ label, id }) => (
            <a
              key={id}
              href={isHome ? `#${id}` : `/#${id}`}
              className="nav-inquire"
              onClick={(e) => handleNavClick(e, id)}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            /* Close (X) icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="5" y1="5" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="19" y1="5" x2="5" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            /* Hamburger (3 lines) icon */
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <line x1="3" y1="7"  x2="21" y2="7"  stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="17" x2="21" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`nav-mobile-menu${menuOpen ? " nav-mobile-menu--open" : ""}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ label, id }) => (
          <a
            key={id}
            href={isHome ? `#${id}` : `/#${id}`}
            className="nav-mobile-menu__link"
            onClick={(e) => handleNavClick(e, id)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
