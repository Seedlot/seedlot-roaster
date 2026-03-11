"use client"

export default function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="px-4 py-12 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-6">
          <span className="text-xs font-medium text-accent bg-forest px-3 py-1 rounded-full uppercase tracking-wider">
            Free Tool
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl text-charcoal uppercase tracking-wide mb-4">
          AI-Powered Roast Profiles<br />for ROEST
        </h1>

        <p className="text-grey-50 text-lg mb-2 max-w-xl mx-auto">
          Describe your coffee, choose a flavor target, and let AI build an optimized
          9-point roast curve for your ROEST sample roaster.
        </p>

        <p className="text-grey-40 text-sm mb-8">
          Bring your own Anthropic API key. Your key goes directly to Anthropic and is never stored.
        </p>

        <button
          onClick={onNext}
          className="px-8 py-4 rounded-xl bg-accent text-forest font-bold text-base uppercase tracking-wider hover:bg-accent-dark transition-colors min-h-[56px]"
        >
          Build a Profile
        </button>

        <div className="mt-12 grid grid-cols-3 gap-6 text-left">
          <div>
            <div className="font-heading text-xl text-charcoal uppercase mb-1">Describe</div>
            <p className="text-grey-50 text-sm">Enter your coffee&apos;s origin, altitude, processing, and moisture content.</p>
          </div>
          <div>
            <div className="font-heading text-xl text-charcoal uppercase mb-1">Target</div>
            <p className="text-grey-50 text-sm">Choose the flavor profile you want — from bright & floral to dark & bold.</p>
          </div>
          <div>
            <div className="font-heading text-xl text-charcoal uppercase mb-1">Roast</div>
            <p className="text-grey-50 text-sm">Get a complete 9-point curve, machine settings, and during-roast checklist.</p>
          </div>
        </div>

        <p className="mt-12 text-xs text-grey-40">
          Powered by{" "}
          <a
            href="https://github.com/Seedlot/seedlot-ai-roaster"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-grey-50"
          >
            seedlot-ai-roaster
          </a>
          {" "}— open source roasting knowledge base by Seedlot
        </p>
      </div>
    </div>
  )
}
