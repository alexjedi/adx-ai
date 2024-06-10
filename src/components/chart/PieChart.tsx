import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import TooltipCustom from './Tooltip'

const COLORS = ['#2c0d68', '#7733f4', '#a387fe', '#F9A88F', '#39C7FF']

const PieChartComponent = ({
  data,
  isOnlyValue,
}: {
  data: { name: string; value: number }[]
  isOnlyValue?: boolean
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart width={400} height={300}>
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
        layout={isOnlyValue ? 'vertical' : 'horizontal'}
        align={isOnlyValue ? 'center' : 'right'}
        verticalAlign={isOnlyValue ? 'bottom' : 'middle'}
        width={250}
      />
    </PieChart>
  </ResponsiveContainer>
)

export default PieChartComponent
