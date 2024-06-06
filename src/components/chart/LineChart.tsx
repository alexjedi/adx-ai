import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const LineChartComponent = ({ data, title, xKey, yKey }) => (
  <div>
    <h3>{title}</h3>
    <LineChart
      width={500}
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
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
    </LineChart>
  </div>
)

export default LineChartComponent
