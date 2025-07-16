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

// Add gap between legend and chart (for the number to NOT overlap the legend)
const legendGap = {
  id: 'legendGap',
  beforeInit(chart, _args, opts) {
    const extra = opts.gap ? opts.gap : 14;

    const fitValue = chart.legend.fit;

    chart.legend.fit = function fitWithGap() {
      fitValue.call(this);
      this.height += extra;
    };
  },
};

ChartJS.register(legendGap);

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
import { useIntl } from 'react-intl';
import { createNoDataPlugin } from './noDataPlugin';

const StackedBarComponent = ({
  title,
  subtitle,
  labels,
  datasets,
  tooltipLabelFormatter,
}) => {
  const intl = useIntl();

  // If all fields in datasets.data are 0 set noDataFlag to true
  const noDataFlag = datasets.every(item => item.data.every(data => data === 0));

  const noData = createNoDataPlugin(intl);

  const chartData = {
    labels: labels || [],
    datasets: (datasets || []).flat().map((ds, index) => ({
      ...ds,
      backgroundColor: COLORS[index % COLORS.length],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
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
        display: (subtitle ? true : false) && !noDataFlag,
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
        offset: -5,
        clamp: true,
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
      noData: {
        noDataFlag
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        display: !noDataFlag,
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
      <Bar data={chartData} options={options} plugins={[noData]} />
    </div>
  );
};

export default StackedBarComponent;
