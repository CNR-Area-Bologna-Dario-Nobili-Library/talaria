import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import './style.scss';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
);

ChartJS.register(ChartDataLabels);

import { COLORS } from './config';

const BarComponent = ({
  title,
  subtitle,
  labels,
  datasets,
  tooltipLabelFormatter,
}) => {
  const chartData = {
    labels: labels || [],
    datasets: (datasets || []).map((ds, index) => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: COLORS[index % COLORS.length],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
                return `${context.dataset.label}: ${context.raw}`;
              },
        },
      },
      datalabels: {
        display: 'auto',
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold',
          size: 12,
        },
        color: 'black',
        formatter: function(value, context) {
          const chart = context.chart;
          const dataIndex = context.dataIndex;

          // Get total from ALL datasets: visible or hidden
          const total = chart.data.datasets.reduce(
            (sum, ds) => sum + (ds.data[dataIndex] || 0),
            0,
          );

          // Find the topmost visible stack
          const visibleDatasets = chart.data.datasets
            .map((ds, i) => ({ ds, meta: chart.getDatasetMeta(i), index: i }))
            .filter(({ meta }) => !meta.hidden);

          const topVisibleIndex = visibleDatasets
            .map(v => v.index)
            .reduce((max, val) => Math.max(max, val), -1);

          // Only render label on the top visible dataset
          if (context.datasetIndex === topVisibleIndex) {
            return total;
          }

          return null;
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
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
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarComponent;
