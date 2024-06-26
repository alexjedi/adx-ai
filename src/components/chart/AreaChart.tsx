'use client'
import React from 'react'

import { Area, AreaChart as AreaRechart, ResponsiveContainer } from 'recharts'

const AreaChart = ({
  width = '100%',
  height = 350,
  data,
  colors,
  stack = false,
  children,
}: {
  width?: string
  height?: number
  data: any[]
  colors?: string[]
  stack?: boolean
  children?: React.ReactNode
}) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaRechart data={data}>
        <defs>
          {colors?.map((color: string | undefined, index: any) => (
            <linearGradient
              key={`color-${index}`}
              id={`color-${index}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {children}
        {data.map((dkey, index) => (
          <Area
            key={index}
            stackId={stack ? 1 : index}
            dataKey={dkey}
            stroke={colors ? colors[index] : 'black'}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color-${index})`}
          />
        ))}
      </AreaRechart>
    </ResponsiveContainer>
  )
}

export default AreaChart
