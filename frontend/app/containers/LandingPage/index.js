/**
 *
 * LandingPage
 *
 */
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import LandingPageAdminBox from '../../components/LandingPageAdminBox';
import LandingPageInstitutionsBox from '../../components/LandingPageInstitutionsBox';
import LandingPageProjectsBox from '../../components/LandingPageProjectsBox';
import LandingPageConsortiaBox from '../../components/LandingPageConsortiaBox';
import LandingPageLibrariesBox from '../../components/LandingPageLibrariesBox';
import LandingPagePatronBox from '../../components/LandingPagePatronBox';
import { requestPermissions } from '../Auth/AuthProvider/actions';
import { requestAcceptPermission, requestRejectPermission } from './actions';
import request from '../../utils/request';
function LandingPage(props) {
  console.log('LandingPage:', props);
  const { dispatch } = props;

  const patrons_enabled =
    process.env.MANAGE_PATRONS && process.env.MANAGE_PATRONS == 'true'
      ? true
      : false;
  const { match, history } = props;
  const intl = useIntl();
  const [resourceId, setResourceId] = useState(null); // State to track resource ID
  const [refreshPermissions, setrefreshPermissions] = useState(null);

  const AcceptPermission = useCallback(
    id => {
      setResourceId(id); // Set resource ID to trigger data fetching
      dispatch(requestAcceptPermission(id, 1));
      setrefreshPermissions({ resourceId: id }); // Ensure new object for deep comparison
    },
    [dispatch, setrefreshPermissions],
  );

  useEffect(() => {
    if (resourceId) {
      dispatch(requestPermissions(resourceId)); // Fetch permissions based on resource ID
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
      setResourceId(id); // Set resource ID to trigger data fetching
      dispatch(requestRejectPermission(id, 2));
      setrefreshPermissions({ resourceId: id }); // Ensure new object for deep comparison
    },
    [dispatch, setrefreshPermissions],
  );

  /*const [PatronReg,setPatronReg]=useState (true);
  const togglePatronReg = () => {setPatronReg(true); setLibraryReg(false);}
  const [LibraryReg,setLibraryReg]=useState (false);
  const toggleLibraryReg = () => {setLibraryReg(true); setPatronReg(false);}  

  useEffect(() => {
  if(patrons_enabled)
    togglePatronReg()
  else toggleLibraryReg()
    
  }, [patrons_enabled])*/

  return (
    /*(props.auth.permissions.roles && props.auth.permissions.roles.includes("registered") && 
          (!props.auth.permissions.resources || props.auth.permissions.resources.length==0) 
          && 
       <>       
       <p>{intl.formatMessage({id:'app.containers.LandingPage.intro'})}</p>       
       <p>{intl.formatMessage({id:'app.containers.LandingPage.intro_library'})}</p>       
       {patrons_enabled && 
        <p>{intl.formatMessage({id:'app.containers.LandingPage.intro_patron'})}</p>
       }
       <nav>
       {patrons_enabled && <NavLink
              className="btn btn-primary mx-3"
              key="associateLib"                                            
              isActive={()=>PatronReg}         
              onClick={(e)=>togglePatronReg()}      
              to="#"        
        >{intl.formatMessage({id:'app.global.patron'})}</NavLink>}
        <NavLink
              className="btn btn-primary mx-3"
              key="registernewlibrary"                                          
              isActive={()=>LibraryReg}        
              to="#"        
              onClick={(e)=>toggleLibraryReg()}            
        >{intl.formatMessage({id:'app.global.librarian'})}</NavLink>           
        </nav>
        <div className="card-form card">
          {(patrons_enabled && PatronReg) && <MyLibraryPage match={match} auth={props.auth}/>}
          {LibraryReg && <RegisterLibrary {...props.auth}/> }  
        </div>
        </>
       ||
       <>       
       <p>You've multiple roles, please choose one from below</p>
        Roles List:
        <ul>
          <li>Role 1</li>
          <li>Role 2</li>
          <li>Role 3</li>
        </ul>
      </>)

      OLD CODE TO CHECK PERMISSIONS/ROLES...
      {props.auth.permissions.roles.length == 1 &&
          props.auth.permissions.roles.includes('registered') &&
          Object.keys(props.auth.permissions.resources).length == 0 && (
            <div>just registered</div>
          )}
        {props.auth.permissions.roles.length >= 1 &&
          props.auth.permissions.roles.includes('patron') && <div>Patron</div>}
        <br />
        {props.auth.permissions.roles.length == 0 && <div>NO ROLES</div>}
        <br />
        {props.auth.permissions.roles.length >= 1 && (
          <div>ONE/MANY ROLES (including "registered") </div>
        )}
        <br />
        {props.auth.permissions.resources.libraries &&
          props.auth.permissions.resources.libraries.length >= 1 && (
            <div>ONE/MANY LIBRARIES</div>
          )}
        {props.auth.permissions.resources.institutions &&
          props.auth.permissions.resources.institutions.length >= 1 && (
            <div>ONE/MANY INSTITUTIONS</div>
          )}

    */

    <>
      <h1>{intl.formatMessage({id: "app.containers.LandingPage.header"})}</h1>
      <div className="container">        
        <div className="landingBoxes d-flex flex-row justify-content-start flex-wrap">
          <LandingPagePatronBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.PatronBox.title"})}
            auth={props.auth}
            match={props.match}
          />
          <LandingPageLibrariesBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.LibrariesBox.title"})}
            auth={props.auth}
            match={props.match}
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
          />
          <LandingPageConsortiaBox
            history={history}
            title={intl.formatMessage({id: "app.containers.LandingPage.ConsortiaBox.title"})}
            auth={props.auth}
            match={props.match}
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

export default LandingPage;
