import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { requestdownloadFile, cleanFileDownload } from './actions';
import fileDownloadSelector from './selectors';
import FileDownloadForm from '../../components/FileDownloadForm';
import LoadingSpinner from '../LoadingSpinner';

const FileDownload = (props) => {
  console.log("FileDownload props:", props);
  const { dispatch, filedownload, isLoading, filehash, libraryid, reqid } = props;
  const [downloaded, setDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const GetfiledownloadBase64 = () => {
    setDownloaded(false);
    setIsDownloading(true);
    if (filehash) {
      dispatch(requestdownloadFile(reqid, filehash, libraryid, "", "", ""));
    }
  };

  const isValidBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const downloadFileContent = (fileContent, fileName) => {
    const binaryString = window.atob(fileContent);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;  // Use filehash as filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    setDownloaded(true);
    setIsDownloading(false);
  };

  useEffect(() => {
    if (isDownloading && filedownload.filecontent && !downloaded) {
      if (!filedownload.filecontent || !isValidBase64(filedownload.filecontent)) {
        console.error('Invalid or empty file content.');
        setIsDownloading(false);
        return;
      }

      console.log('File content available. Downloading...');
      downloadFileContent(filedownload.filecontent, filehash);  // Pass filehash as filename
    }
  }, [filedownload.filecontent, downloaded, isDownloading, filehash]);

  useEffect(() => {
    if (downloaded || (!isDownloading && filedownload.filecontent === null)) {
      console.log("Clearing file download state");
      dispatch(cleanFileDownload());
    }
  }, [downloaded, dispatch, isDownloading, filedownload.filecontent]);

  return (
    <>
      <FileDownloadForm
        FileDownloadCallBack={() => GetfiledownloadBase64()}
        isLoading={isLoading}
      />
      {isDownloading && <LoadingSpinner />}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  filedownload: fileDownloadSelector()
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

export default compose(withConnect)((FileDownload));
