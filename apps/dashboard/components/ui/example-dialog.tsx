"use client"
import { useState } from 'react'
import { Button } from './button'

export function ExampleDialog(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Open</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-[#0F172A] p-4 text-gray-100 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Example dialog</h3>
              <button className="text-gray-400 hover:text-gray-200" onClick={() => setOpen(false)}>✕</button>
            </div>
            <p className="text-sm text-gray-300">This is a lightweight dialog placeholder (ShadCN init pending).</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setOpen(false)}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
