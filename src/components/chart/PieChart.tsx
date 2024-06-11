import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import TooltipCustom from './Tooltip'
import { useWindowDimensions } from '@/lib/hooks'

const COLORS = ['#2c0d68', '#7733f4', '#a387fe', '#F9A88F', '#39C7FF']

const PieChartComponent = ({
  data,
  isOnlyValue,
}: {
  data: { name: string; value: number }[]
  isOnlyValue?: boolean
}) => {
  const { height, width } = useWindowDimensions()

  const isScreenLessThan400px = width < 400

  return (
    <ResponsiveContainer width="100%" height={!isScreenLessThan400px ? 300 : 500}>
      <PieChart
        cx="50%"
        cy="50%"
        width={400}
        margin={{ top: 0, right: 0, bottom: 0, left: isScreenLessThan400px ? 140 : 0 }}
        height={!isScreenLessThan400px ? 300 : 500}
      >
        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={10}
          label={!isOnlyValue ? ({ value }) => `${value}%` : false}
          labelLine
          legendType="line"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={isOnlyValue ? (index > 0 ? '#f5f3ff' : COLORS[index]) : COLORS[index]}
            />
          ))}
          {isOnlyValue && <Label value={`${data[0].value}`} position="center" />}
        </Pie>
        <Tooltip content={TooltipCustom} />
        <Legend
          layout={isOnlyValue ? 'vertical' : !isScreenLessThan400px ? 'horizontal' : 'vertical'}
          align={isOnlyValue ? 'center' : 'right'}
          verticalAlign={isOnlyValue ? 'bottom' : !isScreenLessThan400px ? 'middle' : 'bottom'}
          width={250}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default PieChartComponent
