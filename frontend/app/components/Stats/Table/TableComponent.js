import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useIntl } from 'react-intl';

const TableComponent = ({ title, data, headers }) => {
  const intl = useIntl();

  if (!data || data.length === 0 || !headers || headers.length === 0) {
    return (
      <div className="my-4">
        <h2 className="text-center text-muted">
          {intl.formatMessage({ id: 'app.stats.noData' })}
        </h2>
      </div>
    );
  }

  const sortCaret = (order) => {
    const iconClass = !order
      ? 'fas fa-sort'
      : order === 'asc'
      ? 'fas fa-sort-up'
      : 'fas fa-sort-down';

    return (
      <span style={{ paddingLeft: '0.5rem' }}>
        <i className={`${iconClass}`} style={{ fontSize: '0.75rem' }}  />
      </span>
    )
  };

  // Column definitions
  const enhancedColumns = headers.map(col => ({
    ...col,
    sort: true,
    sortCaret,
  }));

  return (
    <div className="my-4">
      <h2 className="text-center">{title}</h2>
      <BootstrapTable
        keyField={headers[0].dataField}
        data={data}
        columns={enhancedColumns}
        striped
        hover
      />
    </div>
  );
};

export default TableComponent;