import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const COLORS = ['#2c0d68', '#7733f4', '#a387fe', '#F9A88F', '#39C7FF']

const LineChartComponent = ({ data, Key1, Key2, Key3 }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey={Key1} stackId="1" stroke="#8884d8" fill="#8884d8" />
      <Area type="monotone" dataKey={Key2} stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      <Area type="monotone" dataKey={Key3} stackId="1" stroke="#ffc658" fill="#ffc658" />
    </AreaChart>
  </ResponsiveContainer>
)

export default LineChartComponent
