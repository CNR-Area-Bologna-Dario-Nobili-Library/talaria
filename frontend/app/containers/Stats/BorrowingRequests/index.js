import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchBorrowingRequests } from "../actions";
import Selectors from "../Selectors";
import { Pie } from "react-chartjs-2";
import { getChartData } from "../../../utils/stats";

const BorrowingRequestsStats = (props) => {
  const { data, dispatch, loading, error } = props;

  const [selectors, setSelectors] = useState({
    year: "",
    borrowing_library_id: "",
    material_type: "",
    borrowing_status: "",
    fulfill_type: "",
    notfulfill_type: ""
  });

  const [activeChart, setActiveChart] = useState('main');
  const [subChartData, setSubChartData] = useState({});
  const [subChartOptions, setSubChartOptions] = useState({});

  const handleChange = (selectorName, value) => {
    // console.log("handleChange", selectorName, value);
    setSelectors((prevSelectors) => ({
      ...prevSelectors,
      [selectorName]: value,
    }))
  };

  const materialTypeNames = {
    1: 'Article',
    2: 'Book chapter',
    3: 'Thesis',
    4: 'Cartography / Map',
    5: 'Manuscript'
  };

  const borrowingStatusNames = {
    "in_progress": 'In progress',
    "fulfilled": 'Received',
    "not_fulfilled": 'Not received',
    "canceled": 'Canceled',
    "not_fulfilled_forwarded": 'Not received and forwarded',
    "fulfillled_not_received": 'Fulfilled by lender but not received',
    "fulfillled_not_received_forwarded": 'Fulfilled by lender but not received and forwarded'
  };

  const fulfillTypeNames = {
    1: 'Secure Electronic Delivery - SED',
    2: 'Mail',
    3: 'Fax',
    4: 'URL',
    5: 'Article Exchange',
    6: 'Other'
  }

  const notFulfillTypeNames = {
    1: 'Not available for ILL',
    2: 'Not Held',
    3: 'Not on shelf',
    4: 'ILL not permitted by license or copyright law',
    5: 'Wrong reference',
    6: 'Order exceeding the maximum number of weekly requests',
    7: 'Other'
  }

  useEffect(() => {
    const { year, borrowing_library_id, material_type, borrowing_status, fulfill_type, notfulfill_type } = selectors;
    dispatch(fetchBorrowingRequests(year, borrowing_library_id, material_type, borrowing_status, fulfill_type, notfulfill_type));
  }, [dispatch, selectors]);

  useEffect(() => {
    if (!loading) {
      if (selectors.borrowing_status !== 2 && selectors.borrowing_status !== 3) {
        setActiveChart('main');
      }
      if (selectors.borrowing_status === 2) {
        setSubChartData(getFulfillTypeChartData().chartData);
        setSubChartOptions(getFulfillTypeChartData().options);
        setActiveChart('subFulfilled');
      } else if (selectors.borrowing_status === 3) {
        setSubChartData(getNotFulfillTypeChartData().chartData);
        setSubChartOptions(getNotFulfillTypeChartData().options);
        setActiveChart('subNotFulfilled');
      }
    }
  }, [selectors.borrowing_status, loading, data]);

  const getMaterialTypeChartData = () => getChartData(data.aggregations.by_material_type.buckets, materialTypeNames, 'Material Type Distribution');

  console.log("borrowingStatusNames", borrowingStatusNames);

  const getBorrowingStatusChartData = () => getChartData(data.aggregations.by_borrowing_status.buckets, borrowingStatusNames, 'Borrowing status Distribution');
  
  const getFulfillTypeChartData = () => getChartData(data.aggregations.by_fulfill_type.buckets, fulfillTypeNames, 'Fulfill Types Distribution');

  const getNotFulfillTypeChartData = () => getChartData(data.aggregations.by_notfulfill_type.buckets, notFulfillTypeNames, 'Not Fulfill Types Distribution');

  const handlePieChartClick = (element) => {
    const chartElement = element[0];

    // if (chartElement) {
    //   console.log("Click: " + getBorrowingStatusChartData().labels[chartElement._index]);
    // }
  
    if (chartElement) {
      // console.log("Click: " + getBorrowingStatusChartData().chartData.labels[chartElement._index]);

      if (getBorrowingStatusChartData().chartData.labels[chartElement._index] === 'Received') {
        setSelectors({ ...selectors, borrowing_status: 2 });
      }

      if (getBorrowingStatusChartData().chartData.labels[chartElement._index] === 'Not received') {
        setSelectors({ ...selectors, borrowing_status: 3 });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Borrowing Requests</h1>

      <Selectors selectors={selectors} onChange={handleChange} />

      {/* Display the data counter if available */}
      {data && data.hits && data.hits.total && (
        <div>
          <p>Total Requests: {data.hits.total.value}</p>
        </div>
      )}

      {/* Material type pie chart */}
      {data && data.aggregations && data.aggregations.by_material_type && (
        <Pie data={getMaterialTypeChartData().chartData} options={getMaterialTypeChartData().options} />
      )}

      {/* Borrowing status pie chart */}
      {data && data.aggregations && data.aggregations.by_borrowing_status && (
        // <Pie data={getBorrowingStatusChartData()} />
        <>
        {activeChart === 'main' ? (
          <Pie data={getBorrowingStatusChartData().chartData} options={getBorrowingStatusChartData().options} getElementAtEvent={handlePieChartClick} />
        ) : (
          <Pie data={subChartData} options={subChartOptions} />
        )}
  
        {(activeChart === 'subFulfilled' || activeChart === 'subNotFulfilled') && (
          <button onClick={() => { setActiveChart('main'); setSelectors({ ...selectors, borrowing_status: "" })}}>Back to Main Chart</button>
        )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.stats.borrowing_requests_data,
  loading: state.stats.loading,
  error: state.stats.error,
});

export default connect(mapStateToProps)(BorrowingRequestsStats);