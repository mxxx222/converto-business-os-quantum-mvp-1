"use client"
import { Button } from '../../../components/ui/button'
import { ExampleDialog } from '../../../components/ui/example-dialog'
import { Input } from '../../../components/ui/input'
import { Tooltip } from '../../../components/ui/tooltip'

export default function StyleGuide() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold text-blue-400">UI StyleGuide</h1>
      <section className="space-x-2">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </section>
      <section className="space-x-2">
        <ExampleDialog />
        <Tooltip content="Helpful info">
          <Button size="sm" variant="outline">Tooltip target</Button>
        </Tooltip>
      </section>
      <section className="max-w-sm space-y-2">
        <label className="text-sm text-gray-300">Input</label>
        <Input placeholder="Type here" />
      </section>
    </div>
  )
}


