
import Link from 'next/link'

export default function Home() {
  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Plan. Celebrate. Remember.</div>

      <section className="hero">
        <div className="kicker">Celebration Intelligence Platform</div>
        <h1>Beautifully manage every moment.</h1>
        <p>Momente’ helps families and planners organize guests, seating, check-in, QR lookup, hotels, vendors, budgets, timelines, and insights for meaningful celebrations.</p>
        <div style={{ marginTop: 24 }}>
          <Link className="button" href="/raja-anjali">Open Raja & Anjali Wedding</Link>
          <Link className="button secondary" href="/raja-anjali/find-table">Find Your Table</Link>
        </div>
      </section>

      <section className="grid">
        <div className="card col4"><h3>Plan</h3><p className="sub">Guests, tables, seating, RSVP, hotels, vendors, and timelines.</p></div>
        <div className="card col4"><h3>Celebrate</h3><p className="sub">QR lookup, welcome desk check-in, readiness, and guest support.</p></div>
        <div className="card col4"><h3>Remember</h3><p className="sub">A future home for photos, messages, memories, and thank-you notes.</p></div>
      </section>
    </main>
  )
}
