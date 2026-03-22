import Nav from "@/components/Nav";
import WorkGrid from "@/components/WorkGrid";
import { client, allProjectsQuery } from "@/lib/sanity";

export const metadata = {
  title: "Work",
};

export default async function WorkPage() {
  let projects = [];
  try {
    projects = await client.fetch(allProjectsQuery);
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
