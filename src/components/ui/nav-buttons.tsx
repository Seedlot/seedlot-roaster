"use client"

export default function NavButtons({
  onBack,
  onNext,
  canAdvance,
  nextLabel = "Next",
  loading = false,
}: {
  onBack: () => void
  onNext: () => void
  canAdvance: boolean
  nextLabel?: string
  loading?: boolean
}) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-grey-10 px-4 py-3 no-print">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-grey-20 text-grey-60 font-medium text-sm hover:bg-grey-5 transition-colors min-h-[48px]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canAdvance || loading}
          className="flex-1 py-3 rounded-xl bg-accent text-forest font-bold text-sm uppercase tracking-wider hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[48px]"
        >
          {loading ? "Loading..." : nextLabel}
        </button>
      </div>
    </div>
  )
}
