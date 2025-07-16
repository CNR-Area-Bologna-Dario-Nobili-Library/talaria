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

const GroupedBarComponent = ({
  title,
  subtitle,
  labels,
  datasets,
  tooltipLabelFormatter
}) => {
  const intl = useIntl();

  // If all fields in datasets.data are 0 set noDataFlag to true
  const noDataFlag = datasets.every(item => item.data.every(data => Number(data) === 0 || data === null));

  const noData = createNoDataPlugin(intl);

  const chartData = {
    labels: labels || [],
    datasets: (datasets || []).map((dataset, index) => ({
      ...dataset,
      backgroundColor: COLORS[index % COLORS.length],
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
      },
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
        font: {
          weight: 'bold',
        },
      },
      noData: {
        noDataFlag
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        display: !noDataFlag,
        stacked: false,
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
}

export default GroupedBarComponent;