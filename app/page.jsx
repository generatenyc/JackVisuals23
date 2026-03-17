import Nav from "@/components/Nav";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* Phase 3+: Full section components replace these placeholders */}
        <section id="sec-home">
          <div className="flex items-center justify-center h-full">
            <h1 className="font-headline text-4xl">Jack Visuals</h1>
          </div>
        </section>

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

        <section id="sec-services">
          <div className="flex items-center justify-center h-full">
            <h2 className="font-headline text-3xl" style={{ opacity: 0.3 }}>
              Services
            </h2>
          </div>
        </section>

        <section id="sec-trusted">
          <div className="flex items-center justify-center h-full">
            <h2 className="font-headline text-3xl" style={{ opacity: 0.3 }}>
              Trusted By
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
