/*
 * LibraryOperatorEditPermissionPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectLibrary,{isLibraryLoading} from "../selectors";
import {useIntl} from 'react-intl';
import {compose} from "redux";
import messages from './messages'
import { connect } from 'react-redux';
import {requestGetLibraryOperatorPermissions, requestGetLibraryOperator, requestUpdateLibraryOperatorPermissions} from '../actions';
import Loader from 'components/Form/Loader';
import SectionTitle from 'components/SectionTitle';
import confirm from "reactstrap-confirm";
import LibraryEditPermissionsForm from '../../../components/Library/LibraryEditPermissionsForm';


function LibraryOperatorEditPermissionPage(props) {
  console.log('LibraryOperatorEditPermissionPage', props)
  const {isLoading, match, dispatch,library,history} = props;

  const intl = useIntl();

  const data=library.operatorPerm
  const ope=library.operator
  

  
  useEffect(() => {            
    if(!isLoading){  
        dispatch(requestGetLibraryOperator(match.params.library_id,match.params.userid))      
        dispatch(requestGetLibraryOperatorPermissions(match.params.library_id,match.params.userid))                 
  }}, [match.params.library_id,match.params.userid])

  async function updatePerms (perms) {          
      
      let msg=intl.formatMessage({id: "app.containers.LibraryOperatorEditPermissionPage.askUpdatePermissionMessage"})
      
      
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
          {library && library.operatorPerm && 
          <div className="detail">
              <SectionTitle                         
                  title={messages.header}
              />                 
              <LibraryEditPermissionsForm history={history} submitCallback={(p)=>updatePerms(p)} data={data} operatorData={ope}/>                            
          </div>}
      </Loader>     
  );
}
const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  isLoading: isLibraryLoading(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LibraryOperatorEditPermissionPage);

