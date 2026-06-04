"use client"

import CardSelect from '@/components/ui/card-select'
import { BATCH_SIZES } from '@/lib/constants'
import type { BatchSize } from '@/lib/types'

const batchSizeOptions = BATCH_SIZES as readonly {
  id: BatchSize
  label: string
  description: string
}[]

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
  const selectedBatchSize = batchSize ?? '100'
  const selectedBatch = batchSizeOptions.find((option) => option.id === selectedBatchSize) || batchSizeOptions[1]
  const selectedBatchNumber = Number(selectedBatch.id)
  const profileType = selectedBatch.id === '200' ? 'Bean / inlet temperature' : 'Air temperature'

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

        <div className="bg-white border border-grey-10 rounded-xl p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <label htmlFor="batch-weight" className="block text-sm font-medium text-grey-70">
                Batch Weight
              </label>
              <p className="text-xs text-grey-50 mt-1">
                Snaps to ROEST-safe 50g intervals.
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="font-heading text-3xl text-charcoal leading-none">{selectedBatch.label}</div>
              <div className="text-xs text-grey-50 mt-1">{profileType}</div>
            </div>
          </div>

          <input
            id="batch-weight"
            type="range"
            min="50"
            max="200"
            step="50"
            value={selectedBatchNumber}
            onChange={(event) => onBatchSizeChange(String(event.currentTarget.value) as BatchSize)}
            className="w-full accent-forest"
            aria-valuetext={`${selectedBatch.label} ${profileType}`}
          />

          <div className="grid grid-cols-4 text-xs text-grey-50 mt-3">
            {batchSizeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => onBatchSizeChange(option.id)}
                className={`text-center py-1 rounded-md transition-colors ${
                  option.id === selectedBatch.id
                    ? 'font-semibold text-forest bg-accent/20'
                    : 'hover:bg-grey-5'
                }`}
                aria-pressed={option.id === selectedBatch.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-sm text-grey-60 mt-4">
            {selectedBatch.description}
          </p>
        </div>

        {selectedBatch.id === '200' && (
          <div className="mt-4 p-4 bg-terracotta/10 border border-terracotta/30 rounded-xl">
            <p className="text-sm text-terracotta-dark">
              <strong>Note:</strong> 200g batches use <strong>inlet temperature</strong> profiles instead of air temperature.
              This is due to the thermal mass feedback loop at higher batch sizes - air temp profiles become unstable.
              The generated curve will use inlet temperature values.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
