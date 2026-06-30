'use client'
import { createClient } from '@supabase/supabase-js'
import { useMemo, useState } from 'react'
import Link from 'next/link'

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (!lines.length) return []

  const split = (line: string) => {
    const out: string[] = []
    let cur = ''
    let quote = false

    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (c === '"') {
        quote = !quote
      } else if (c === ',' && !quote) {
        out.push(cur.trim())
        cur = ''
      } else {
        cur += c
      }
    }

    out.push(cur.trim())
    return out
  }

  const headers = split(lines[0]).map(h => h.toLowerCase())
  return lines.slice(1).map(line => {
    const vals = split(line)
    const row: any = {}
    headers.forEach((h, i) => row[h] = vals[i] || '')
    return row
  })
}

function normalize(r: any, side: string, i: number) {
  return {
    id: `${side}-${i}`,
    name: r['guest name'] || r['name'] || `Guest ${i + 1}`,
    family: r['family'] || '',
    side: r['side'] || side,
    mealPreference: r['meal preference'] || 'Vegetarian',
    dietaryNotes: r['dietary notes'] || '',
    rsvp: r['rsvp'] || 'Accepted'
  }
}

export default function ImportWizard() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [groomRows, setGroomRows] = useState<any[]>([])
  const [brideRows, setBrideRows] = useState<any[]>([])
  const [tableRows, setTableRows] = useState<any[]>([])

  const groom = useMemo(() => groomRows.map((r, i) => normalize(r, 'Groom Side', i)), [groomRows])
  const bride = useMemo(() => brideRows.map((r, i) => normalize(r, 'Bride Side', i)), [brideRows])

  const tableMap = useMemo(() => {
    const m: Record<string, { event: string, table: string }> = {}
    tableRows.forEach(r => {
      const n = String(r['guest name'] || r['name'] || '').toLowerCase().trim()
      if (n) m[n] = { event: r['event'] || 'Reception', table: r['table'] || '' }
    })
    return m
  }, [tableRows])

  const merged = useMemo(() => {
    return [...groom, ...bride].map(g => {
      const t = tableMap[g.name.toLowerCase().trim()]
      return { ...g, event: t?.event || 'Reception', table: t?.table || '' }
    })
  }, [groom, bride, tableMap])

  const assigned = merged.filter(g => g.table).length
  const jain = merged.filter(g => `${g.mealPreference} ${g.dietaryNotes}`.toLowerCase().includes('jain')).length
  const dups = merged.filter((g, i, a) =>
    a.findIndex(x => x.name.toLowerCase().trim() === g.name.toLowerCase().trim()) !== i
  ).length

  function load(e: any, type: string) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const p = parseCsv(String(reader.result || ''))
      if (type === 'groom') setGroomRows(p)
      if (type === 'bride') setBrideRows(p)
      if (type === 'table') setTableRows(p)
    }
    reader.readAsText(file)
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'momente-master-guest-list.json'
    a.click()
  }

  async function saveToSupabase() {
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', 'raja-anjali')
      .maybeSingle()

    if (eventError || !eventData) {
  alert(`Could not find event. Error: ${eventError?.message || 'No event returned'}`)
  return
    }

    const rows = merged.map(g => ({
      event_id: eventData.id,
      guest_name: g.name,
      family: g.family || null,
      meal_preference: g.mealPreference || 'Vegetarian',
      dietary_notes: g.dietaryNotes || null,
      rsvp: g.rsvp || 'Accepted',
      table_number: g.table || null,
      notes: g.side || null
    }))

    const { error } = await supabase.from('guests').insert(rows)

    if (error) {
      alert(`Import failed: ${error.message}`)
      return
    }

    alert(`${rows.length} guests imported into Supabase.`)
  }

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Clean Import Wizard</div>

      <section className="hero">
        <div className="kicker">v1.3 Clean Foundation</div>
        <h1>Import bride and groom guests</h1>
        <p>Both sides use the same simple template. No old groom data. No mixed formats.</p>
        <Link className="button secondary" href="/raja-anjali">Back to Wedding Workspace</Link>
      </section>

      <section className="grid">
        <div className="card col4">
          <h2>1. Groom Guests</h2>
          <input type="file" accept=".csv" onChange={e => load(e, 'groom')} />
          <p className="sub">{groom.length} groom-side guests loaded.</p>
        </div>

        <div className="card col4">
          <h2>2. Bride Guests</h2>
          <input type="file" accept=".csv" onChange={e => load(e, 'bride')} />
          <p className="sub">{bride.length} bride-side guests loaded.</p>
        </div>

        <div className="card col4">
          <h2>3. Table Assignments</h2>
          <input type="file" accept=".csv" onChange={e => load(e, 'table')} />
          <p className="sub">{tableRows.length} table rows loaded.</p>
        </div>
      </section>

      <section className="grid">
        <div className="card col3"><div className="sub">Total Guests</div><div className="big">{merged.length}</div></div>
        <div className="card col3"><div className="sub">Tables Assigned</div><div className="big">{assigned}</div></div>
        <div className="card col3"><div className="sub">Strict Jain</div><div className="big">{jain}</div></div>
        <div className="card col3"><div className="sub">Duplicates</div><div className="big">{dups}</div></div>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <h2>Templates</h2>
        <a className="button secondary" href="/templates/guest_import_template.csv">Download Guest Template</a>
        <a className="button secondary" href="/templates/table_assignment_template.csv">Download Table Assignment Template</a>
      </section>

      {merged.length > 0 && (
        <section className="card" style={{ marginTop: 18 }}>
          <h2>Preview Master Guest List</h2>
          <button className="button" onClick={exportJson}>Export Master Guest JSON</button>
          <button className="button" onClick={saveToSupabase}>Import to Supabase</button>

          <div style={{ overflowX: 'auto', marginTop: 18 }}>
            <table>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Side</th>
                  <th>Meal</th>
                  <th>Dietary</th>
                  <th>Event</th>
                  <th>Table</th>
                </tr>
              </thead>
              <tbody>
                {merged.slice(0, 100).map((g, i) => (
                  <tr key={i}>
                    <td>{g.name}</td>
                    <td>{g.side}</td>
                    <td>{g.mealPreference}</td>
                    <td>{g.dietaryNotes}</td>
                    <td>{g.event}</td>
                    <td>{g.table || 'TBD'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  )
}