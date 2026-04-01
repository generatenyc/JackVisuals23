import Nav from "@/components/Nav";
import AboutNew from "@/components/sections/AboutNew";

export const metadata = {
  title: "About — Jack Visuals (Sandbox)",
};

export default function NewAboutPage() {
  return (
    <>
      <Nav />
      <main>
        <AboutNew />
      </main>
    </>
  );
}
