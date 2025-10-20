'use client'
import { useState } from 'react'

export default function TenantSwitcher() {
  const [tenant, setTenant] = useState('T1')
  return (
    <div className="flex items-center gap-2 text-xs">
      <label className="opacity-70">Tenant</label>
      <select value={tenant} onChange={(e) => setTenant(e.target.value)} className="bg-transparent border rounded px-2 py-1">
        <option value="T1">T1</option>
        <option value="T2">T2</option>
      </select>
    </div>
  )
}


