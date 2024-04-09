/*
 * LibraryOperatorEditPermissionPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectAdmin,{isAdminLoading} from "../selectors";
import {useIntl} from 'react-intl';
import {compose} from "redux";
import messages from './messages'
import { connect } from 'react-redux';
import {requestGetLibrary, requestGetLibraryOperatorPermissions, requestUpdateLibraryOperatorPermissions,requestGetLibraryOperator} from '../actions';
import Loader from 'components/Form/Loader';
import SectionTitle from 'components/SectionTitle';
import confirm from "reactstrap-confirm";
import LibraryEditPermissionsForm from '../../../components/Library/LibraryEditPermissionsForm';


function AdminLibraryOperatorEditPermissionPage(props) {
  console.log('AdminLibraryOperatorEditPermissionPage', props)
  const {isLoading, match, dispatch,admin,history} = props;

  const intl = useIntl();

  const data=admin.operatorPerm
  const lib=admin.library
  const ope=admin.operator
   
  useEffect(() => {            
    if(!isLoading){      
        dispatch(requestGetLibraryOperator(match.params.library_id,match.params.userid))   
        dispatch(requestGetLibrary(match.params.library_id))        
        dispatch(requestGetLibraryOperatorPermissions(match.params.library_id,match.params.userid))                 
  }}, [match.params.library_id,match.params.userid])

  async function updatePerms (perms) {          
      
      let msg=intl.formatMessage({id: "app.containers.AdminLibraryOperatorEditPermissionPage.askUpdatePermissionMessage"})
      
      
      let conf = await confirm({
          title: intl.formatMessage({id: 'app.global.confirm'}),
           message: msg,
           confirmText: intl.formatMessage({id: 'app.global.yes'}),
           cancelText: intl.formatMessage({id: 'app.global.no'})
       }); 
     
      if(conf)
      {
        let permString=''
        Object.keys(perms).forEach(p=>{
         if(perms[p])
         {
          if(permString!="") permString=permString.concat(',');
          permString=permString.concat(p)
         }
        })        
        dispatch(requestUpdateLibraryOperatorPermissions(match.params.library_id,match.params.userid,permString,intl.formatMessage({id: "app.global.updatedMessage"})))
      }    
}
  

  return (              
      <Loader show={isLoading}>
        {lib && <h2>{lib.name}</h2>}     
          {admin && admin.operatorPerm && 
          <div className="detail">
              <SectionTitle       
                  back={true}
                  title={messages.header}
              />                 
              <LibraryEditPermissionsForm history={history} submitCallback={(p)=>updatePerms(p)} data={data}  operatorData={ope}/>                            
          </div>}
      </Loader>     
  );
}
const mapStateToProps = createStructuredSelector({
  admin: makeSelectAdmin(),
  isLoading: isAdminLoading(),
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
  
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AdminLibraryOperatorEditPermissionPage);

