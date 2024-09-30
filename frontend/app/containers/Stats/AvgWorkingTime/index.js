import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Bar } from "react-chartjs-2";
import { fetchAvgTimeRequest } from "../actions";

const AvgTimeStats = (props) => {
  const { data, dispatch, loading, error } = props;

  const [year, setYear] = useState("");

  useEffect(() => {
    dispatch(fetchAvgTimeRequest(year));
  }, [dispatch, year]);

  const getChartData = () => {
    if (!data || !data.aggregations) return null;

    const labels = data.aggregations.requests_per_month.buckets.map(bucket => bucket.key_as_string);
    // const avgWorkingTimeData = data.aggregations.requests_per_month.buckets.map(bucket => bucket.avg_working_time.value);

    const avgWorkingTimeData = data.aggregations.requests_per_month.buckets.map(bucket => 
      (bucket.avg_working_time.value / 1000 / 60 / 60 / 24).toFixed(2) // Converts to days and rounds to 2 decimal places
    );

    return {
      labels: labels,
      datasets: [
        {
          label: 'Average Working Time in days',
          data: avgWorkingTimeData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color TO CHANGE WHEN WORKING ON COLORS
        },
      ],
    };
  };

  const chartData = getChartData();

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Average Working Time</h1>

      <div>
        <label htmlFor="year-select">Select Year: </label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          <option value={""}>All</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>

      {chartData ? (
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Average Working Time per Month',
            },
          },
        }} />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.stats.avg_working_time_data,
  loading: state.stats.loading,
  error: state.stats.error,
});

export default connect(mapStateToProps)(AvgTimeStats);
