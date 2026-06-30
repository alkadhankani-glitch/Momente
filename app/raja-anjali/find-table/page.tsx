'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export default function FindTable() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [query, setQuery] = useState('')
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadGuests() {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('guest_name')

      if (!error && data) setGuests(data)
      setLoading(false)
    }

    loadGuests()
  }, [])

  const q = query.trim().toLowerCase()

  const matches = q.length < 2
    ? []
    : guests
        .filter(g => String(g.guest_name || '').toLowerCase().includes(q))
        .slice(0, 20)

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Live Guest Lookup</div>

      <section className="hero">
        <div className="kicker">Welcome to</div>
        <h1>Raja & Anjali’s Reception</h1>
        <p>Search your name to find your table and meal preference.</p>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <input
          className="search"
          placeholder="Type your first or last name..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />

        {loading && <p className="sub">Loading guests...</p>}

        {!loading && guests.length === 0 && (
          <div className="result">
            <h2>No guest data found</h2>
            <p className="sub">Import bride and groom guests first.</p>
          </div>
        )}

        {!loading && q.length >= 2 && matches.length === 0 && guests.length > 0 && (
          <div className="result">
            <h2>Name not found</h2>
            <p className="sub">Please visit the welcome desk for help.</p>
          </div>
        )}

        {matches.map((g: any) => (
          <div className="result" key={g.id}>
            <h2>{g.guest_name}</h2>
            <div className="tableBig">Table {g.table_number || 'TBD'}</div>
            <p className="sub">
              {g.notes || 'Guest'} · Reception · {g.meal_preference || 'Vegetarian'}
              {g.dietary_notes ? ` · ${g.dietary_notes}` : ''}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}