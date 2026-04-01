import Nav from "@/components/Nav";
import WorkGrid from "@/components/WorkGrid";
import { client, allProjectsQuery } from "@/lib/sanity";

export const metadata = {
  title: "Work — Jack Visuals | Video Production Portfolio",
  description:
    "Watch cinematic brand films, event coverage, and commercial videos produced by Jack Visuals in Trinidad and Tobago.",
  alternates: {
    canonical: "https://jackvisuals23.com/work",
  },
};

export default async function WorkPage() {
  let projects = [];
  try {
    projects = await client.fetch(allProjectsQuery, {}, {
      next: { revalidate: 3600 },
    });
  } catch {
    /* Sanity fetch failed — WorkGrid will show placeholder cards */
  }

  return (
    <>
      <Nav />
      <main id="work-page">
        <div className="wp-header">
          <h1 className="wp-title">All Projects</h1>
        </div>
        <WorkGrid projects={projects} />
      </main>
    </>
  );
}
