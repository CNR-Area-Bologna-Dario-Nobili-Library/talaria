import React, { useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useState } from 'react';

import { cleanFileUpload, requestuploadFile } from './actions';
import fileUploadSelector from './selectors';
import { Card, Row, Col } from 'reactstrap';
import FileUploadForm from '../../components/FileUploadForm';
import { useIntl } from 'react-intl';
import LoadingSpinner from '../LoadingSpinner';


const FileUpload = props => {
  console.log('FileUpload:', props);
  const { dispatch, data, fileupload, cleanuploadprops } = props;
  const [Showspinner, setShowspinner] = useState(false);
  const [ShowMessage, setShowMessage] = useState(false);
  const MaxFileUpload = process.env.MAX_UPLOAD_FILE;
  const AllowedFileTypes = process.env.FILE_EXTENSION;
  const intl = useIntl();

  const uploadFile = (data, file, originalfilename, hideMessageFlag) => {
    if (hideMessageFlag === 1) {
      setShowspinner(true);
      setShowMessage(false); // Hide message when new upload starts
      console.log(file, originalfilename);

      // Reset previous fileupload status ONLY when starting a new upload
      dispatch(cleanFileUpload());

      dispatch(
        requestuploadFile(
          props.data.id,
          props.data.lending_library_id,
          file,
          originalfilename,
          props.data.lending_status,
          '',
          '',
        ),
      );
    }
  };

  // Handle upload completion
  useEffect(() => {
    if (fileupload && fileupload.status) {
      props.parentCallback(fileupload);
      setShowspinner(false);
      setShowMessage(true); // Show message ONLY after upload completes
    }
  }, [fileupload]);

  // Reset states on component switch
  useEffect(() => {
    return () => {
      setShowspinner(false);
      setShowMessage(false);
      dispatch(cleanFileUpload()); // Reset upload state when unmounting
    };
  }, [dispatch]);

  return (
    <>
      <FileUploadForm
        FileUploadCallBack={uploadFile}
        AllowedFileTypes={process.env.FILE_EXTENSION}
      />
      {Showspinner && <LoadingSpinner />}
      {fileupload && !Showspinner && fileupload.status && ShowMessage && (
        <span className="fileuploadstatusmessage">
          {fileupload.status === 'uploaded' && (
            <span className="text-success">
              <h4>
                {intl.formatMessage({ id: 'app.requests.UploadSuccess' })}
              </h4>
            </span>
          )}
          {fileupload.status === 'failed' && (
            <span className="text-danger">
              <h4>{intl.formatMessage({ id: 'app.requests.UploadFail' })}</h4>
            </span>
          )}
          {fileupload.status ===
            'The Uploaded File Exceeds the defined upload_max_filesize' && (
            <span className="text-danger">
              <h4>
                {intl.formatMessage({
                  id: 'app.requests.exceed_max_file_upload',
                })}
              </h4>
            </span>
          )}
        </span>
      )}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  fileupload: fileUploadSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(FileUpload);
