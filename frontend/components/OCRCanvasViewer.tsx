"use client"

import React, { useEffect, useRef, useState } from 'react'

type Box = { x: number; y: number; w: number; h: number }

export default function OCRCanvasViewer({ imageUrl }: { imageUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [boxes, setBoxes] = useState<Box[]>([])
  const [drag, setDrag] = useState<{ startX: number; startY: number; box?: Box } | null>(null)

  useEffect(() => {
    const i = new Image()
    i.onload = () => setImg(i)
    i.src = imageUrl
  }, [imageUrl])

  useEffect(() => {
    const c = canvasRef.current
    if (!c || !img) return
    const ctx = c.getContext('2d')!
    const scale = Math.min(c.width / img.width, c.height / img.height)
    const iw = img.width * scale
    const ih = img.height * scale
    const ox = (c.width - iw) / 2
    const oy = (c.height - ih) / 2
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(img, ox, oy, iw, ih)
    ctx.strokeStyle = '#22c55e'
    ctx.fillStyle = 'rgba(34,197,94,0.2)'
    ctx.lineWidth = 2
    boxes.forEach(b => {
      ctx.fillRect(ox + b.x * scale, oy + b.y * scale, b.w * scale, b.h * scale)
      ctx.strokeRect(ox + b.x * scale, oy + b.y * scale, b.w * scale, b.h * scale)
    })
  }, [img, boxes])

  const toImageSpace = (evt: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
    const x = evt.clientX - rect.left
    const y = evt.clientY - rect.top
    if (!img) return { x: 0, y: 0 }
    const scale = Math.min(c.width / img.width, c.height / img.height)
    const iw = img.width * scale
    const ih = img.height * scale
    const ox = (c.width - iw) / 2
    const oy = (c.height - ih) / 2
    return { x: (x - ox) / scale, y: (y - oy) / scale }
  }

  const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!img) return
    const p = toImageSpace(e)
    setDrag({ startX: p.x, startY: p.y })
  }

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!img || !drag) return
    const p = toImageSpace(e)
    const w = Math.max(1, p.x - drag.startX)
    const h = Math.max(1, p.y - drag.startY)
    setDrag({ ...drag, box: { x: drag.startX, y: drag.startY, w, h } })
  }

  const onUp = () => {
    if (drag?.box) setBoxes(prev => [...prev, drag.box!])
    setDrag(null)
  }

  // Redraw temporary box while dragging
  useEffect(() => {
    if (!img || !drag?.box) return
    const c = canvasRef.current!
    const ctx = c.getContext('2d')!
    const scale = Math.min(c.width / img.width, c.height / img.height)
    const iw = img.width * scale
    const ih = img.height * scale
    const ox = (c.width - iw) / 2
    const oy = (c.height - ih) / 2
    ctx.save()
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.strokeRect(ox + drag.box.x * scale, oy + drag.box.y * scale, drag.box.w * scale, drag.box.h * scale)
    ctx.restore()
  }, [drag, img])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-[600px] border rounded-md bg-black"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    />
  )
}


