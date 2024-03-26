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
import {requestGetLibraryOperator, requestUpdateLibraryOperatorPermissions} from '../actions';
import Loader from 'components/Form/Loader';
import SectionTitle from 'components/SectionTitle';
import confirm from "reactstrap-confirm";
import EditPermissionsForm from '../../../components/EditPermissionsForm';


function LibraryOperatorEditPermissionPage(props) {
  console.log('LibraryOperatorEditPermissionPage', props)
  const {isLoading, match, dispatch,library} = props;

  const intl = useIntl();

  const data=library.operatorPerm
  

  
  useEffect(() => {            
    if(!isLoading){        
        dispatch(requestGetLibraryOperator(match.params.library_id,match.params.userid))                 
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
                  back={true}
                  title={messages.header}
              />                 
              <EditPermissionsForm submitCallback={(p)=>updatePerms(p)} data={data}/>                            
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

