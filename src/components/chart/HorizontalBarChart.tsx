import { DataStockOwnership } from '@/lib/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'

const COLORS = ['#2c0d68', '#7733f4', '#a387fe', '#F9A88F', '#39C7FF']

const HorizontalBarChart = ({
  data,
  xKey,
  yKey,
  y2Key,
}: {
  data: DataStockOwnership[]
  xKey: string
  yKey: string
  y2Key?: string
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      height={300}
      data={data}
      layout="vertical"
      margin={{
        top: 30,
        right: 20,
        left: 40,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 100]} />
      <YAxis type="category" dataKey={xKey} stroke={COLORS[0]} />
      <Legend />
      <Bar dataKey={yKey} fill={COLORS[0]}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
        <LabelList dataKey={yKey} position="right" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)

export default HorizontalBarChart
