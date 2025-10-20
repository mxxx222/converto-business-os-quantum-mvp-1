"use client"
import * as React from 'react'

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open ? (
        <span className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white shadow">
          {content}
        </span>
      ) : null}
    </span>
  )
}


