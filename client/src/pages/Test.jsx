import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { getLivedata } from '../services/apiServices';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const Test = () => {
  const [data, setData] = useState([]);

  const fetchLiveData = async () => {

    const res = await getLivedata();
    if (res && res.data) {
      setData(res.data);
    } else {
      console.error('Failed to fetch live data:', res);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 200);
    return () => clearInterval(interval);
  }, []);

  // Group values into ranges (just for pie demo)
  const pieData = [
    { name: 'Low (<22)', value: data.filter(d => d.value < 22).length },
    { name: 'Normal (22-24)', value: data.filter(d => d.value >= 22 && d.value <= 24).length },
    { name: 'High (24-26)', value: data.filter(d => d.value > 24 && d.value <= 26).length },
    { name: 'Very High (>26)', value: data.filter(d => d.value > 26).length },
  ];

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">📈 Real-Time Dashboard</h1>

      {/* Line Chart */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Live Line Chart</h2>
        <LineChart width={800} height={300} data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        </LineChart>
      </div>

      {/* Pie Chart */}
      <div className="flex flex-wrap gap-12">
        <div>
          <h2 className="text-lg font-semibold mb-2">Category Pie Chart</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>

        {/* Donut Chart */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Donut Chart</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`donut-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Test;
