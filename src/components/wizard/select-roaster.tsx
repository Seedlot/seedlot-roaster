"use client"

import CardSelect from '@/components/ui/card-select'
import { BATCH_SIZES } from '@/lib/constants'
import type { BatchSize } from '@/lib/types'

export default function SelectRoaster({
  batchSize,
  onBatchSizeChange,
}: {
  batchSize: BatchSize | null
  onBatchSizeChange: (v: BatchSize) => void
}) {
  const roasterOptions = [
    { id: 'roest', label: 'ROEST', description: 'Sample roaster (S100, S200)' },
    { id: 'aillio', label: 'Aillio Bullet', description: 'Home drum roaster', disabled: true, disabledLabel: 'Coming Soon' },
    { id: 'ikawa', label: 'Ikawa', description: 'Air roaster', disabled: true, disabledLabel: 'Coming Soon' },
  ]

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-heading text-2xl sm:text-3xl text-charcoal uppercase tracking-wide text-center mb-1">
          Select Roaster & Batch Size
        </h2>
        <p className="text-grey-50 text-sm text-center mb-6">
          Choose your roaster and batch weight.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-grey-70 mb-2">Roaster</label>
          <CardSelect
            options={roasterOptions}
            selected="roest"
            onSelect={() => {}}
            columns={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-grey-70 mb-2">Batch Size</label>
          <CardSelect
            options={BATCH_SIZES as unknown as { id: string; label: string; description: string }[]}
            selected={batchSize}
            onSelect={(id) => onBatchSizeChange(id as BatchSize)}
            columns={3}
          />
        </div>

        {batchSize === '200' && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> 200g batches use <strong>inlet temperature</strong> profiles instead of air temperature.
              This is due to the thermal mass feedback loop at higher batch sizes — air temp profiles become unstable.
              The generated curve will use inlet temperature values.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
