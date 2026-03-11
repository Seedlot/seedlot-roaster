"use client"

type CardOption = {
  id: string
  label: string
  description: string
  disabled?: boolean
  disabledLabel?: string
}

export default function CardSelect({
  options,
  selected,
  onSelect,
  columns = 2,
}: {
  options: readonly CardOption[] | CardOption[]
  selected: string | null
  onSelect: (id: string) => void
  columns?: 2 | 3
}) {
  return (
    <div className={`grid gap-3 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => !opt.disabled && onSelect(opt.id)}
          disabled={opt.disabled}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            opt.disabled
              ? 'opacity-40 cursor-not-allowed border-grey-20 bg-grey-5'
              : selected === opt.id
                ? 'border-accent bg-accent/5 ring-2 ring-accent'
                : 'border-grey-20 bg-white hover:border-grey-30'
          }`}
        >
          <div className="font-semibold text-sm text-charcoal">{opt.label}</div>
          <div className="text-xs text-grey-50 mt-1">{opt.description}</div>
          {opt.disabled && opt.disabledLabel && (
            <div className="text-xs text-grey-40 mt-1 italic">{opt.disabledLabel}</div>
          )}
        </button>
      ))}
    </div>
  )
}
