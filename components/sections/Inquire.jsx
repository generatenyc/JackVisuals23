"use client";

import "./Inquire.css";

export default function Inquire() {
  return (
    <section id="sec-inquire">
      {/* Nav clearance */}
      <div className="zone-top" />

      {/* Eyebrow */}
      <div className="zone-eyebrow">
        <div className="inquire-eyebrow">Get In Touch</div>
      </div>

      {/* Headline — mobile only, hidden on desktop */}
      <div className="zone-headline">
        <h2 className="inquire-headline">
          Let&rsquo;s create
          <br />
          something you
          <br />
          can <em>feel.</em>
        </h2>
      </div>

      {/* Form zone — single column mobile, two-column desktop */}
      <div className="zone-main">
        {/* Left column — headline + sub (desktop only) */}
        <div className="inquire-left">
          <h2 className="inquire-headline">
            Let&rsquo;s create
            <br />
            something you
            <br />
            can <em>feel.</em>
          </h2>
          <p className="inquire-sub">
            Tell us about your project — events, brand campaigns, corporate
            productions or something entirely new.
          </p>
        </div>

        {/* Form column */}
        <div className="inquire-form">
          {/* Sub text — mobile only */}
          <p className="inquire-sub inquire-sub-mobile">
            Tell us about your project — events, brand campaigns, or something
            entirely new.
          </p>

          <form
            action="https://formspree.io/f/REPLACE_WITH_ID"
            method="POST"
          >
            <div className="form-row">
              <input
                className="form-field"
                type="text"
                name="name"
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-row">
              <input
                className="form-field"
                type="email"
                name="email"
                placeholder="Email address"
                required
              />
            </div>
            <div className="form-row">
              <textarea
                className="form-field"
                name="message"
                placeholder="Tell us about your project..."
              />
            </div>
            <button type="submit" className="form-submit">
              Start a Conversation
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="zone-bottom">
        <div className="footer-divider" />
        <div className="footer-content">
          <div className="footer-logo">JACK VISUALS</div>
          <div className="footer-links">
            <a
              href="https://instagram.com/jackvisuals23"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="rgba(255,255,255,0.5)"
                  stroke="none"
                />
              </svg>
              <span>@jackvisuals23</span>
            </a>
            <a href="mailto:nathan@rjaonline.com">nathan@rjaonline.com</a>
          </div>
          <div className="footer-copy">
            &copy; 2025 Jack Visuals &middot; jackvisuals23.com &middot; All
            Rights Reserved
          </div>
        </div>
      </div>
    </section>
  );
}
