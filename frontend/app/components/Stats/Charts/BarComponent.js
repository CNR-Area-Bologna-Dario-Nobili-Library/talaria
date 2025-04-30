import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
} from 'chart.js';

import './style.scss';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

const COLORS = [
  '#135AE1',
  '#F54E8B',
  '#FA6502',
  '#F2B90F',
  '#BB0035',
  '#36C634',
  '#9852D9',
];

const BarComponent = ({
  title,
  subtitle,
  labels,
  data,
  datasetLabel = 'Data',
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data,
        backgroundColor: COLORS.slice(0, data.length),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (Number.isInteger(value)) return value;
            return null;
          },
        },
      },
    },
  };

  return (
    <div className="pie-chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarComponent;
