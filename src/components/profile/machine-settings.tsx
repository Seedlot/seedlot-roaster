"use client"

export default function MachineSettings({
  settings,
  totalTime,
}: {
  settings: { power: number; fan: number; drumRPM: number }
  totalTime: string
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-grey-10 mb-4">
      <h3 className="font-medium text-sm text-charcoal mb-3">ROEST Machine Settings</h3>
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="font-heading text-2xl text-forest">{settings.power}%</div>
          <div className="text-xs text-grey-50">Power</div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl text-forest">{settings.fan}%</div>
          <div className="text-xs text-grey-50">Fan</div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl text-forest">{settings.drumRPM}</div>
          <div className="text-xs text-grey-50">Drum RPM</div>
        </div>
        <div className="text-center">
          <div className="font-heading text-2xl text-forest">{totalTime}</div>
          <div className="text-xs text-grey-50">Total Time</div>
        </div>
      </div>
    </div>
  )
}
