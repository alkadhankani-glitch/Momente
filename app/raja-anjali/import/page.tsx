'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter(l => l.trim())
  if (!lines.length) return []
  const split = (line: string) => {
    const out: string[] = []
    let cur = '', quote = false
    for (let i=0;i<line.length;i++) {
      const c=line[i]
      if (c === '"' && line[i+1] === '"') { cur += '"'; i++ }
      else if (c === '"') quote = !quote
      else if (c === ',' && !quote) { out.push(cur.trim()); cur='' }
      else cur += c
    }
    out.push(cur.trim())
    return out
  }
  const headers = split(lines[0]).map(h => h.toLowerCase())
  return lines.slice(1).map(line => {
    const vals = split(line)
    const row: any = {}
    headers.forEach((h,i)=>row[h]=vals[i]||'')
    return row
  })
}

export default function ImportWizard() {
  const [guestRows, setGuestRows] = useState<any[]>([])
  const [tableRows, setTableRows] = useState<any[]>([])
  const [sideDefault, setSideDefault] = useState('Bride Side')

  const guests = useMemo(() => guestRows.map((r, i) => ({
    name: r['guest name'] || r['name'] || `Guest ${i+1}`,
    family: r['family'] || '',
    side: r['side'] || sideDefault,
    mealPreference: r['meal preference'] || 'Vegetarian',
    dietaryNotes: r['dietary notes'] || '',
    rsvp: r['rsvp'] || 'Accepted'
  })), [guestRows, sideDefault])

  const tableMap = useMemo(() => {
    const map: Record<string, {event:string, table:string}> = {}
    tableRows.forEach(r => {
      const name = String(r['guest name'] || r['name'] || '').toLowerCase().trim()
      if (name) map[name] = { event: r['event'] || 'Reception', table: r['table'] || '' }
    })
    return map
  }, [tableRows])

  const merged = useMemo(() => guests.map(g => {
    const match = tableMap[g.name.toLowerCase().trim()]
    return { ...g, event: match?.event || 'Reception', table: match?.table || '' }
  }), [guests, tableMap])

  const strictJain = merged.filter(g => `${g.mealPreference} ${g.dietaryNotes}`.toLowerCase().includes('jain')).length
  const assigned = merged.filter(g => g.table).length
  const duplicates = merged.filter((g, idx, arr) => arr.findIndex(x => x.name.toLowerCase().trim() === g.name.toLowerCase().trim()) !== idx)

  function handleFile(e:any, type:'guest'|'table') {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => type === 'guest' ? setGuestRows(parseCsv(String(reader.result || ''))) : setTableRows(parseCsv(String(reader.result || '')))
    reader.readAsText(file)
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'momente-master-guest-list.json'
    a.click()
  }

  return (
    <main className="shell">
      <h1 className="brand">Momente’</h1>
      <div className="tagline">Import Wizard · Wedding Operations Edition</div>
      <section className="hero">
        <div className="kicker">Step 1</div>
        <h1>Import guests and tables</h1>
        <p>Simple imports only: guest information, meal preference, and table assignment. Seat assignment comes later.</p>
        <div style={{marginTop:24}}><Link className="button secondary" href="/raja-anjali">Back to Wedding Workspace</Link></div>
      </section>

      <section className="grid">
        <div className="card col6">
          <h2>1. Guest Import</h2>
          <p className="sub">Columns: Guest Name, Family, Side, Meal Preference, Dietary Notes, RSVP</p>
          <select className="search" value={sideDefault} onChange={e=>setSideDefault(e.target.value)} style={{marginBottom:12}}>
            <option>Bride Side</option>
            <option>Groom Side</option>
          </select>
          <input type="file" accept=".csv" onChange={e=>handleFile(e,'guest')} />
          <p className="sub"><a href="/templates/guest_import_template.csv">Download guest template</a></p>
        </div>

        <div className="card col6">
          <h2>2. Table Assignment Import</h2>
          <p className="sub">Columns: Guest Name, Event, Table</p>
          <input type="file" accept=".csv" onChange={e=>handleFile(e,'table')} />
          <p className="sub"><a href="/templates/table_assignment_template.csv">Download table assignment template</a></p>
        </div>
      </section>

      <section className="grid">
        <div className="card col3"><div className="sub">Imported Guests</div><div className="big">{merged.length}</div></div>
        <div className="card col3"><div className="sub">Tables Assigned</div><div className="big">{assigned}</div></div>
        <div className="card col3"><div className="sub">Strict Jain</div><div className="big">{strictJain}</div></div>
        <div className="card col3"><div className="sub">Possible Duplicates</div><div className="big">{duplicates.length}</div></div>
      </section>

      {merged.length > 0 && <section className="card" style={{marginTop:18}}>
        <h2>Preview Master Guest List</h2>
        <button className="button" onClick={exportJson}>Export Master Guest JSON</button>
        <div style={{overflowX:'auto', marginTop:18}}>
          <table>
            <thead><tr><th>Guest</th><th>Side</th><th>Meal</th><th>Dietary</th><th>Event</th><th>Table</th></tr></thead>
            <tbody>{merged.slice(0,50).map((g,i)=><tr key={i}><td>{g.name}</td><td>{g.side}</td><td>{g.mealPreference}</td><td>{g.dietaryNotes}</td><td>{g.event}</td><td>{g.table || 'TBD'}</td></tr>)}</tbody>
          </table>
        </div>
      </section>}
    </main>
  )
}
