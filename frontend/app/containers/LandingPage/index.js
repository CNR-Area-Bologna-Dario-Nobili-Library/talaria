import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { requestPermissions } from '../Auth/AuthProvider/actions';

import {  
  requestAcceptPermission,
  requestRejectPermission,
} from './actions';


import LandingPagePatronBox from '../../components/LandingPagePatronBox';
import LandingPageLibrariesBox from '../../components/LandingPageLibrariesBox';
import LandingPageInstitutionsBox from '../../components/LandingPageInstitutionsBox'
import LandingPageConsortiasBox from '../../components/LandingPageConsortiaBox'
import LandingPageProjectsBox from '../../components/LandingPageProjectsBox'
import LandingPageAdminBox from '../../components/LandingPageAdminBox'



function LandingPage(props) {
  const { auth, dispatch,  history, match } = props;
  const intl = useIntl();
  const [mounted,setMounted]=useState(false);
  const [resourceId, setResourceId] = useState(null);
  const [refreshPermissions, setrefreshPermissions] = useState(null);



  const AcceptPermission = useCallback(
    id => {
      setResourceId(id);
      dispatch(requestAcceptPermission(id, 1,intl.formatMessage({id:"app.containers.LandingPage.acceptedMessage"})));
      setrefreshPermissions({ resourceId: id });
    },
    [dispatch],
  );

  useEffect(() => {
   setMounted(true)
  }, []);


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
      dispatch(requestRejectPermission(id, 2,intl.formatMessage({id:"app.containers.LandingPage.rejectedMessage"})));
      setrefreshPermissions({ resourceId: id });
    },
    [dispatch],
  );

  
  
  return (
    mounted &&
      <>    
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="card text-center" style={{ width: '55rem' }}>
          <div className="card-body">
            <h2 className="text-primary">
            {intl.formatMessage({id: 'app.containers.LandingPage.welcome'})} <b>{auth.user.name}</b>
            </h2>
            <p className="card-text lead">
            {intl.formatMessage({id: 'app.containers.LandingPage.welcome_message'})}
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
            onAccept={AcceptPermission}
            onReject={RejectPermission}
          />
          <LandingPageInstitutionsBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.InstitutionsBox.title"})}
            auth={props.auth}
            match={props.match}
            onAccept={AcceptPermission}
            onReject={RejectPermission}
          />
          <LandingPageProjectsBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.ProjectsBox.title"})}
            auth={props.auth}
            match={props.match}
            onAccept={AcceptPermission}
            onReject={RejectPermission}
          />
          <LandingPageConsortiasBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.ConsortiaBox.title"})}
            auth={props.auth}
            match={props.match}
            onAccept={AcceptPermission}
            onReject={RejectPermission}
          />
          <LandingPageAdminBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.AdminBox.title"})}
            auth={props.auth}
            match={props.match}
          />
        </div>
      </div>
    </>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(  
  mapDispatchToProps,
);

export default compose(withConnect)((LandingPage));
