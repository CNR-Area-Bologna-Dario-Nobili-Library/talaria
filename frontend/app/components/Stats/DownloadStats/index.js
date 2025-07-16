import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from 'reactstrap';

const DownloadStats = props => {
  const { CSVDownloadCallBack } = props;
  let intl = useIntl();

  return (
    <Button
      type="button"
      onClick={() => CSVDownloadCallBack()}
      className="btn btn-lg btn-block"
      title={intl.formatMessage({ id: 'app.stats.export.file' })}
    >
      <i className="fa-solid fa-file-csv" />
      &nbsp;{intl.formatMessage({ id: 'app.stats.export.file' })}
    </Button>
  );
};

export default DownloadStats;
