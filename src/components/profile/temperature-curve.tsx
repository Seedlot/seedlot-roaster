"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { CurvePoint } from '@/lib/types'

function timeToSeconds(time: string): number {
  const parts = time.split(':')
  return parseInt(parts[0]) * 60 + parseInt(parts[1])
}

export default function TemperatureCurve({ curve }: { curve: CurvePoint[] }) {
  const data = curve.map(p => ({
    ...p,
    seconds: timeToSeconds(p.time),
    label: p.time,
  }))
  const hasBeanTemperature = data.every(d => typeof (d as { beanTempC?: unknown }).beanTempC === 'number')

  // Find first crack point for reference line
  const fcPoint = data.find(d => d.phase.toLowerCase().includes('first crack') || d.phase.toLowerCase().includes('fc'))

  return (
    <div>
      <h3 className="font-medium text-sm text-charcoal mb-3">
        {hasBeanTemperature ? 'Bean / Inlet Temperature Curve' : 'Air Temperature Curve'}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            domain={['auto', 'auto']}
            unit="°C"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2D2D2D',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff',
            }}
            formatter={(value: number, name: string) => [
              `${value}°C`,
              name === 'beanTempC' ? 'Bean temperature' : hasBeanTemperature ? 'Inlet temperature' : 'Air temperature',
            ]}
            labelFormatter={(label: string) => `Time: ${label}`}
          />
          {fcPoint && (
            <ReferenceLine
              x={fcPoint.label}
              stroke="#B25518"
              strokeDasharray="5 5"
              label={{ value: 'FC', fill: '#B25518', fontSize: 10, position: 'top' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="tempC"
            stroke="#2B3625"
            name={hasBeanTemperature ? 'Inlet temperature' : 'Air temperature'}
            strokeWidth={2.5}
            dot={{ fill: '#9DFF00', stroke: '#2B3625', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#9DFF00', stroke: '#2B3625', strokeWidth: 2, r: 6 }}
          />
          {hasBeanTemperature && (
            <Line
              type="monotone"
              dataKey="beanTempC"
              name="Bean temperature"
              stroke="#B25518"
              strokeWidth={2}
              dot={{ fill: '#F5F1EB', stroke: '#B25518', strokeWidth: 2, r: 3 }}
              activeDot={{ fill: '#F5F1EB', stroke: '#B25518', strokeWidth: 2, r: 5 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
