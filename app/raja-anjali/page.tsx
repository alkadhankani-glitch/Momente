import Link from 'next/link'
import guests from '../../data/guests.json'
import tables from '../../data/tables.json'

export default function RajaAnjali() {
  const checked = (guests as any[]).filter(g => g.checkedIn).length
  const strictJain = (guests as any[]).filter(g => String(g.dietaryNotes || g.mealPreference || '').toLowerCase().includes('jain')).length

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Wedding Operations Edition</div>
      <section className="hero">
        <div className="kicker">Current Celebration</div>
        <h1>Raja ❤️ Anjali</h1>
        <p>Wedding Celebration · Hilton Columbus at Easton · August 14–15, 2026</p>
        <div style={{marginTop:24}}>
          <Link className="button" href="/raja-anjali/import">Import Wizard</Link>
          <Link className="button secondary" href="/raja-anjali/find-table">Guest Lookup</Link>
          <Link className="button secondary" href="/raja-anjali/dashboard">Dashboard</Link>
        </div>
      </section>
      <section className="grid">
        <div className="card col3"><div className="sub">Guests</div><div className="big">{guests.length}</div></div>
        <div className="card col3"><div className="sub">Tables</div><div className="big">{tables.length}</div></div>
        <div className="card col3"><div className="sub">Checked In</div><div className="big">{checked}</div></div>
        <div className="card col3"><div className="sub">Strict Jain</div><div className="big">{strictJain}</div></div>
      </section>
    </main>
  )
}
