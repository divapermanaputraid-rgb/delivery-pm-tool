export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow"> Backend-first MVP</p>
        <h1>Delivery PM Tool</h1>
        <p className="subtitle">
          task and delivery tracking for software teams with GitHub-linked
          visibility
        </p>
      </section>

      <section className="card-grid">
        <article className="card">
          <h2>Current focus</h2>
          <p>stabilize backend fondation</p>
        </article>

        <article className="card">
          <h2>status</h2>
          <p>API health endpoint is already running</p>
        </article>

        <article className="card">
          <h2>next milestone</h2>
          <p>connect frontend to express API</p>
        </article>
      </section>
    </main>
  );
}
