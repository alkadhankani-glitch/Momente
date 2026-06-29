import Link from 'next/link'

export default function Home() {
  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Plan. Celebrate. Remember.</div>
      <section className="hero">
        <div className="kicker">Celebration Intelligence Platform</div>
        <h1>Beautifully manage every moment.</h1>
        <p>Momente’ helps families and planners organize guests, seating, check-in, QR lookup, guest experience, and insights.</p>
        <div style={{marginTop:24}}>
          <Link className="button" href="/raja-anjali">Open Raja & Anjali Wedding</Link>
          <Link className="button secondary" href="/raja-anjali/find-table">Find Your Table</Link>
        </div>
      </section>
    </main>
  )
}
