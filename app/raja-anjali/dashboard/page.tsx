
import guests from '../../../data/guests.json'
import tables from '../../../data/tables.json'
import Link from 'next/link'

export default function Dashboard() {
  const grouped: Record<string, any[]> = {}
  ;(guests as any[]).forEach(g => {
    const table = g.table || 'TBD'
    grouped[table] = grouped[table] || []
    grouped[table].push(g)
  })

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Organizer Dashboard · Raja & Anjali Wedding</div>

      <section className="hero">
        <div className="kicker">Wedding Ready MVP</div>
        <h1>Reception Seating</h1>
        <p>Review table assignments and guest lookup readiness.</p>
        <div style={{ marginTop: 24 }}>
          <Link className="button" href="/raja-anjali/find-table">Test Guest Lookup</Link>
        </div>
      </section>

      <section className="grid">
        {(tables as any[]).map(t => {
          const list = grouped[t.number] || []
          return (
            <div className="card col4" key={t.number}>
              <h3>Table {t.number}</h3>
              <div className="big">{list.length}/{t.capacity}</div>
              <p className="sub">{t.side} · {t.event}</p>
              <ul>
                {list.slice(0, 8).map(g => <li key={g.id}>{g.name}</li>)}
                {list.length > 8 && <li>+ {list.length - 8} more</li>}
              </ul>
            </div>
          )
        })}
      </section>
    </main>
  )
}
