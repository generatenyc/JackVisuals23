import Nav from "@/components/Nav";
import Home from "@/components/sections/Home";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Home />

        {/* Phase 4+: Full section components replace these placeholders */}
        <section id="sec-work">
          <div className="flex items-center justify-center h-full">
            <h2 className="font-headline text-3xl" style={{ opacity: 0.3 }}>
              Featured Work
            </h2>
          </div>
        </section>

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
