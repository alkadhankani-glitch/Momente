
import Link from 'next/link'
import guests from '../../data/guests.json'
import tables from '../../data/tables.json'

export default function RajaAnjali() {
  const guestCount = guests.length
  const tableCount = tables.length
  const capacity = tables.reduce((sum: number, t: any) => sum + Number(t.capacity || 10), 0)
  const assigned = guests.filter((g: any) => g.table).length
  const remaining = capacity - assigned

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Plan. Celebrate. Remember.</div>

      <section className="hero">
        <div className="kicker">Current Celebration</div>
        <h1>Raja ❤️ Anjali</h1>
        <p>Wedding Celebration · Hilton Columbus at Easton · August 14–15, 2026</p>
        <div style={{ marginTop: 24 }}>
          <Link className="button" href="/raja-anjali/find-table">Guest QR Lookup</Link>
          <Link className="button secondary" href="/raja-anjali/dashboard">Organizer Dashboard</Link>
        </div>
      </section>

      <section className="grid">
        <div className="card col3"><div className="sub">Guests</div><div className="big">{guestCount}</div></div>
        <div className="card col3"><div className="sub">Tables</div><div className="big">{tableCount}</div></div>
        <div className="card col3"><div className="sub">Seats Assigned</div><div className="big">{assigned}</div></div>
        <div className="card col3"><div className="sub">Remaining Seats</div><div className="big">{remaining}</div></div>
      </section>

      <section className="grid">
        <div className="card col8">
          <h2>Morning Brief</h2>
          <p><b>Groom-side reception data is loaded.</b></p>
          <p className="sub">Next: import bride-side seating, finalize QR guest lookup, and print welcome sign.</p>
        </div>
        <div className="card col4">
          <h2>Celebration Score™</h2>
          <div className="big">92%</div>
          <p className="sub">Excellent start. Score will become dynamic as RSVP, hotel, budget, and vendor data are added.</p>
        </div>
      </section>
    </main>
  )
}
