import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

import './style.scss';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const COLORS = [
  '#135AE1',
  '#F54E8B',
  '#FA6502',
  '#F2B90F',
  '#BB0035',
  '#36C634',
  '#9852D9',
];

const PieComponent = ({
  title,
  subtitle,
  labels,
  data,
  datasetLabel = 'Data',
  tooltipLabelFormatter,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: datasetLabel,
        data,
        backgroundColor: COLORS.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
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
        callbacks: {
          label: tooltipLabelFormatter
            ? tooltipLabelFormatter
            : function(context) {
                const total = context.chart._metasets[0]._parsed.reduce(
                  (a, b) => a + b,
                  0,
                ); // Sums all slices' value
                const value = context.raw;
                const percentage = ((value / total) * 100).toFixed(2);
                return `${context.label}: ${value} (${percentage}%)`;
              },
        },
      },
      datalabels: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieComponent;
