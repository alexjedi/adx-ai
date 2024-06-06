import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const BarChartComponent = ({ data, title, xKey, yKey }) => (
  <div>
    <h3>{title}</h3>
    <BarChart
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
      <Bar dataKey={yKey} fill="#8884d8" />
    </BarChart>
  </div>
)

export default BarChartComponent
