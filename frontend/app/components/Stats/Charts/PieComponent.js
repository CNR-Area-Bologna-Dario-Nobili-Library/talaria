import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

import './style.scss';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

import { COLORS } from './config';
import { useIntl } from 'react-intl';
import { createNoDataPlugin } from './noDataPlugin';

const PieComponent = ({
  title,
  subtitle,
  labels,
  data,
  datasetLabel = 'Data',
  tooltipLabelFormatter,
}) => {
  const intl = useIntl();

  // If all fields in data.datasets[0].data are "0.00" set noDataFlag to true
  const noDataFlag = data.every(item => item === "0.00");

  const noData = createNoDataPlugin(intl);

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
        display: !noDataFlag,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      subtitle: {
        display: !noDataFlag,
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
      noData: {
        noDataFlag
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} plugins={[noData]} />
    </div>
  );
};

export default PieComponent;
