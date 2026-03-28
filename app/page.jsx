import Nav from "@/components/Nav";
import Home from "@/components/sections/Home";
import FeaturedWork from "@/components/sections/FeaturedWork";
import About from "@/components/sections/About";
import Inquire from "@/components/sections/Inquire";
import {
  client,
  featuredProjectsQuery,
  servicesQuery,
  trustedByQuery,
  productionKitQuery,
} from "@/lib/sanity";

export default async function HomePage() {
  let featuredProjects = [];
  let services = [];
  let trustedBy = [];
  let productionKit = null;

  try {
    featuredProjects = await client.fetch(featuredProjectsQuery);
  } catch {
    /* Sanity fetch failed — FeaturedWork will show placeholder cards */
  }

  try {
    [services, trustedBy, productionKit] = await Promise.all([
      client.fetch(servicesQuery),
      client.fetch(trustedByQuery),
      client.fetch(productionKitQuery),
    ]);
  } catch {
    /* Sanity fetch failed — About will show placeholder text */
  }

  return (
    <>
      <Nav />
      <main>
        <div id="snap-container">
          <Home />
          <FeaturedWork projects={featuredProjects} />
          <About
            services={services}
            trustedBy={trustedBy}
            productionKit={productionKit}
          />
          <Inquire />
        </div>
      </main>
    </>
  );
}
