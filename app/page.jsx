import Nav from "@/components/Nav";
import Home from "@/components/sections/Home";
import FeaturedWork from "@/components/sections/FeaturedWork";
import About from "@/components/sections/About";
import {
  client,
  featuredProjectsQuery,
  servicesQuery,
  trustedByQuery,
} from "@/lib/sanity";

export default async function HomePage() {
  let featuredProjects = [];
  let services = [];
  let trustedBy = [];

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch {
    /* Sanity fetch failed — FeaturedWork will show placeholder cards */
  }

  try {
    [services, trustedBy] = await Promise.all([
      client.fetch(servicesQuery),
      client.fetch(trustedByQuery),
    ]);
  } catch {
    /* Sanity fetch failed — About will show placeholder text */
  }

  return (
    <>
      <Nav />
      <main>
        <Home />
        <FeaturedWork projects={featuredProjects} />
        <About services={services} trustedBy={trustedBy} />

        {/* Phase 6: Full Inquire component replaces this placeholder */}
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
