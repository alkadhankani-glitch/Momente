'use client'
import { useState } from 'react'
import guests from '../../../data/guests.json'
import Link from 'next/link'

export default function FindTable() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const matches = q.length < 2 ? [] : (guests as any[])
    .filter(g => String(g.name || '').toLowerCase().includes(q))
    .slice(0, 20)

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Plan. Celebrate. Remember.</div>
      <section className="hero">
        <div className="kicker">Welcome to</div>
        <h1>Raja & Anjali’s Reception</h1>
        <p>Search your name to find your table.</p>
      </section>
      <section className="card" style={{marginTop:18}}>
        <input className="search" placeholder="Type your first or last name..." value={query} onChange={e=>setQuery(e.target.value)} autoFocus />
        {q.length >= 2 && matches.length === 0 && <div className="result"><h2>Name not found</h2><p className="sub">Please visit the welcome desk for help.</p></div>}
        {matches.map((g:any) => <div className="result" key={g.id}><h2>{g.name}</h2><div className="tableBig">Table {g.table || 'TBD'}</div><p className="sub">{g.side} · {g.event} · {g.mealPreference || 'Vegetarian'} {g.dietaryNotes ? `· ${g.dietaryNotes}` : ''}</p></div>)}
      </section>
      <p className="sub" style={{marginTop:18}}>Powered by <Link href="/">Momente’</Link></p>
    </main>
  )
}
