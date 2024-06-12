import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#814FFC', '#FF4A9C', '#F9A88F', '#31245B', '#39C7FF']

const BarChartComponent = ({
  data,
  xKey,
  yKey,
  y2Key,
}: {
  data: any[]
  xKey: string
  yKey: string
  y2Key?: string
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      height={300}
      data={data}
      margin={{
        top: 30,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis yAxisId="left" orientation="left" stroke={COLORS[0]} />
      {y2Key && <YAxis yAxisId="right" orientation="right" stroke={COLORS[1]} />}
      <Tooltip />
      <Legend />
      <Bar dataKey={yKey} yAxisId="left" fill={COLORS[0]} />
      {y2Key && <Bar dataKey={y2Key} yAxisId="right" fill={COLORS[1]} />}
    </BarChart>
  </ResponsiveContainer>
)

export default BarChartComponent
