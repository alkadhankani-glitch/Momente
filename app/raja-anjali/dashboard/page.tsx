'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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

  const metrics = useMemo(() => {
    const total = guests.length
    const groom = guests.filter(g => g.notes === 'Groom Side').length
    const bride = guests.filter(g => g.notes === 'Bride Side').length
    const accepted = guests.filter(g => String(g.rsvp || '').toLowerCase() === 'accepted').length
    const pending = guests.filter(g => String(g.rsvp || '').toLowerCase() === 'pending').length
    const declined = guests.filter(g => String(g.rsvp || '').toLowerCase() === 'declined').length
    const strictJain = guests.filter(g =>
      `${g.meal_preference || ''} ${g.dietary_notes || ''}`.toLowerCase().includes('jain')
    ).length
    const vegetarian = guests.filter(g =>
      String(g.meal_preference || '').toLowerCase().includes('vegetarian')
    ).length
    const assigned = guests.filter(g => g.table_number).length
    const notAssigned = total - assigned
    const checkedIn = guests.filter(g => g.checked_in).length

    return {
      total,
      groom,
      bride,
      accepted,
      pending,
      declined,
      strictJain,
      vegetarian,
      assigned,
      notAssigned,
      checkedIn
    }
  }, [guests])

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Live Operations Dashboard</div>

      <section className="hero">
        <div className="kicker">Raja ❤️ Anjali</div>
        <h1>Wedding Operations Dashboard</h1>
        <p>Live guest, RSVP, meal, table, and check-in metrics from Supabase.</p>
        <div style={{ marginTop: 24 }}>
          <Link className="button" href="/raja-anjali/import">Import Guests</Link>
          <Link className="button secondary" href="/raja-anjali/find-table">Guest Lookup</Link>
        </div>
      </section>

      {loading ? (
        <section className="card" style={{ marginTop: 18 }}>
          <p className="sub">Loading dashboard...</p>
        </section>
      ) : (
        <>
          <section className="grid">
            <div className="card col3"><div className="sub">Total Guests</div><div className="big">{metrics.total}</div></div>
            <div className="card col3"><div className="sub">Groom Side</div><div className="big">{metrics.groom}</div></div>
            <div className="card col3"><div className="sub">Bride Side</div><div className="big">{metrics.bride}</div></div>
            <div className="card col3"><div className="sub">Checked In</div><div className="big">{metrics.checkedIn}</div></div>
          </section>

          <section className="grid">
            <div className="card col3"><div className="sub">Accepted RSVP</div><div className="big">{metrics.accepted}</div></div>
            <div className="card col3"><div className="sub">Pending RSVP</div><div className="big">{metrics.pending}</div></div>
            <div className="card col3"><div className="sub">Declined RSVP</div><div className="big">{metrics.declined}</div></div>
            <div className="card col3"><div className="sub">Tables Assigned</div><div className="big">{metrics.assigned}</div></div>
          </section>

          <section className="grid">
            <div className="card col3"><div className="sub">Waiting for Table</div><div className="big">{metrics.notAssigned}</div></div>
            <div className="card col3"><div className="sub">Vegetarian</div><div className="big">{metrics.vegetarian}</div></div>
            <div className="card col3"><div className="sub">Strict Jain</div><div className="big">{metrics.strictJain}</div></div>
            <div className="card col3"><div className="sub">Ready for Check-In</div><div className="big">{metrics.total}</div></div>
          </section>

          <section className="card" style={{ marginTop: 18 }}>
            <h2>Recent Guest Records</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Side</th>
                    <th>Meal</th>
                    <th>Table</th>
                    <th>RSVP</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.slice(0, 20).map(g => (
                    <tr key={g.id}>
                      <td>{g.guest_name}</td>
                      <td>{g.notes || ''}</td>
                      <td>{g.meal_preference || 'Vegetarian'}</td>
                      <td>{g.table_number || 'TBD'}</td>
                      <td>{g.rsvp || 'Accepted'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  )
}