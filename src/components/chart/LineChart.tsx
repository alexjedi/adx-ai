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

const LineChartComponent = ({
  data,
  Key1,
  Key2,
  Key3,
}: {
  data: any
  Key1: any
  Key2: any
  Key3: any
}) => (
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
      <Area type="monotone" dataKey={Key1} stackId="1" stroke="#571bbc" fill="#a387fe" />
      <Area type="monotone" dataKey={Key2} stackId="1" stroke="#963a1e" fill="#f59274" />
      <Area type="monotone" dataKey={Key3} stackId="1" stroke="#ad0743" fill="#ffcae7" />
    </AreaChart>
  </ResponsiveContainer>
)

export default LineChartComponent
