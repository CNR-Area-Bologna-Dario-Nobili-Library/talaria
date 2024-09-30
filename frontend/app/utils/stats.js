export const getChartData = (buckets, namesMap, label, backgroundColor = ['#073EBC', '#1585C5', '#A4DAF6', '#A5F2D8', '#AAE147', '#078150', '#5A7367'], hoverBackgroundColor = ['#073EBC', '#1585C5', '#A4DAF6', '#A5F2D8', '#AAE147', '#078150', '#5A7367']) => {
  // const labels = Object.keys(buckets).map((key, index) => key);
  // const values = Object.values(buckets).map(bucket => bucket.doc_count);

  let labels, values;

  // Check if buckets is an array or an object
  if (Array.isArray(buckets)) {
    // Handle case where buckets is an array (like in "by_fulfill_type" or "by_notfulfill_type")
    labels = buckets.map(bucket => namesMap[bucket.key] || bucket.key); // Use the key as the label
    values = buckets.map(bucket => bucket.doc_count);
  } else {
    // Handle case where buckets is an object (like in "by_borrowing_status")
    labels = Object.keys(buckets).map(key => namesMap[key] || key); // Use the bucket name or fallback to the key itself
    values = Object.values(buckets).map(bucket => bucket.doc_count);
  }
  const total = values.reduce((a, b) => a + b, 0);

  console.log("getChartData", labels, values, total);

  // console.log("getChartData", buckets, namesMap, label, backgroundColor, hoverBackgroundColor);
  // console.log("getChartData ", labels, values);

  const chartData = {
    labels,
    datasets: [{
      data: values,
      label: label,
      backgroundColor: backgroundColor,
      hoverBackgroundColor: hoverBackgroundColor,
    }]
  };

  const options = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          let percentage = ((value / total) * 100).toFixed(2) + '%';
          return labels[tooltipItem.index] + ': ' + percentage + ' (' + value + ')';
        }
      }
    }
  };

  return { chartData, options };
}