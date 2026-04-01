"use client";

import dynamic from "next/dynamic";

const AboutPhotoNew = dynamic(() => import("./AboutPhotoNew"), {
  ssr: false,
  loading: () => <div className="an-photo-wrapper" style={{ background: "#111", position: "absolute", inset: 0 }} />,
});

export default function AboutPhotoNewLoader() {
  return <AboutPhotoNew />;
}
