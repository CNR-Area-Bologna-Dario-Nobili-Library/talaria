import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { requestPermissions } from '../Auth/AuthProvider/actions';

import {
  requestLibraryOptionList,
  requestAcceptPermission,
  requestRejectPermission,
} from './actions';
import { makeSelectLibraryList } from './selectors';

import LandingPagePatronBox from '../../components/LandingPagePatronBox';
import LandingPageLibrariesBox from '../../components/LandingPageLibrariesBox';

function LandingPage(props) {
  const { auth, dispatch, libraryList, match } = props;
  const intl = useIntl();
  const [resourceId, setResourceId] = useState(null);
  const [refreshPermissions, setrefreshPermissions] = useState(null);

  useEffect(() => {
    dispatch(requestLibraryOptionList());
  }, [dispatch]);

  const AcceptPermission = useCallback(
    id => {
      setResourceId(id);
      dispatch(requestAcceptPermission(id, 1));
      setrefreshPermissions({ resourceId: id });
    },
    [dispatch],
  );

  useEffect(() => {
    if (resourceId) {
      dispatch(requestPermissions(resourceId));
    }
  }, [dispatch, resourceId]);

  useEffect(() => {
    if (refreshPermissions) {
      dispatch(requestPermissions(refreshPermissions));
      setrefreshPermissions(null);
    }
  }, [dispatch, refreshPermissions]);

  const RejectPermission = useCallback(
    id => {
      setResourceId(id);
      dispatch(requestRejectPermission(id, 2));
      setrefreshPermissions({ resourceId: id });
    },
    [dispatch],
  );

  useEffect(() => {
    console.log("Component received libraryList:", libraryList);
    if (libraryList && libraryList.length > 0) {
      console.log("libraryList has items:", libraryList);
    } else {
      console.log("libraryList is empty or undefined");
    }
  }, [libraryList]);

  useEffect(() => {
    console.log("Component received libraryList:", libraryList); // This should log the expected array.
  }, [libraryList]);
  
  
  return (
    <>
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="card text-center" style={{ width: '55rem' }}>
          <div className="card-body">
            <h2 className="text-primary">
              Welcome, <b>{auth.user.name}</b>
            </h2>
            <p className="card-text lead">
              This is your landing page where you can find the latest patron
              updates, manage your libraries, and add new libraries to your
              collection. Stay updated and manage your library resources
              efficiently.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="landingBoxes d-flex flex-row justify-content-start flex-wrap">
          <LandingPagePatronBox
            history={history}
            title={intl.formatMessage({
              id: 'app.containers.LandingPage.PatronBox.title',
            })}
            auth={auth}
            match={match}
          />
          <LandingPageLibrariesBox
            history={history}
            title={intl.formatMessage({
              id: 'app.containers.LandingPage.LibrariesBox.title',
            })}
            auth={auth}
            match={match}
            libraryList={libraryList}
            onAccept={AcceptPermission}
            onReject={RejectPermission}
          />
          {/* Other components */}
        </div>
      </div>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  libraryList: makeSelectLibraryList() // Correctly mapped to the component's props
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

export default compose(withConnect)((LandingPage));
