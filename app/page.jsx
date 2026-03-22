import Nav from "@/components/Nav";
import Home from "@/components/sections/Home";
import FeaturedWork from "@/components/sections/FeaturedWork";
import { client, featuredProjectsQuery } from "@/lib/sanity";

export default async function HomePage() {
  let featuredProjects = [];
  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch {
    /* Sanity fetch failed — FeaturedWork will show placeholder cards */
  }

  return (
    <>
      <Nav />
      <main>
        <Home />
        <FeaturedWork projects={featuredProjects} />

        {/* Phase 5+: Full section components replace these placeholders */}
        <section id="sec-about">
          <div className="flex items-center justify-center h-full">
            <h2 className="font-headline text-3xl" style={{ opacity: 0.3 }}>
              About
            </h2>
          </div>
        </section>

        <section id="sec-inquire">
          <div className="flex items-center justify-center h-full">
            <h2 className="font-headline text-3xl" style={{ opacity: 0.3 }}>
              Inquire
            </h2>
          </div>
        </section>
      </main>
    </>
  );
}
