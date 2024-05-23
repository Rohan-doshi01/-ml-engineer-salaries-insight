import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Chart({ data }) {
  const chartData = {
    labels: data.map(d => d.year),
    datasets: [
      {
        label: 'Number of Jobs',
        data: data.map(d => d.jobs),
        borderColor: 'rgba(75,192,192,1)',
        fill: false
      },
      {
        label: 'Average Salary (USD)',
        data: data.map(d => d.averageSalary),
        borderColor: 'rgba(153,102,255,1)',
        fill: false
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Box>
      <h2>Job Data Over Time</h2>
      <Line data={chartData} options={options} />
    </Box>
  );
}

export default Chart;
