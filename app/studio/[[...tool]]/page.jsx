"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity/sanity.config";

// TODO: Test embedded studio at /studio after Vercel deployment in Phase 10
// Known issue: Sanity version conflict between root and sanity/ subfolder causes errors locally
// jackvisuals23.sanity.studio works correctly in the meantime

export default function StudioPage() {
  return <NextStudio config={config} />;
}
