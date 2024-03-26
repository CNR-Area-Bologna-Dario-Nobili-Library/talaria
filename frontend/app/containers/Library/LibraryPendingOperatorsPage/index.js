/*
 * LibraryPendingOperatorsPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectLibrary,{isLibraryLoading} from "../selectors";
import {compose} from "redux";
import messages from './messages'
import { connect } from 'react-redux';
import confirm from "reactstrap-confirm";
import {useIntl} from 'react-intl';
import {requestGetLibraryPendingOperators,requestRemoveLibraryPendingOperator} from '../actions';
import PendingOperatorsList from '../../../components/PendingOperatorsList';


function LibraryPendingOperatorsPage(props) {
  console.log('LibraryPendingOperatorsPage', props)
  const {isLoading, match, dispatch,library} = props;

  const pending_operators=library.pending_operators

  const intl = useIntl();

  
 
  useEffect(() => {         
    if(!isLoading){        
        dispatch(requestGetLibraryPendingOperators(match.params.library_id)) 
    }}, [match.params.library_id])

    async function removePendingOperator(pendingid) {          
      
      let msg=intl.formatMessage({id: "app.containers.LibraryOperatorsPage.askRemoveOperatorMessage"})
      
      
      let conf = await confirm({
          title: intl.formatMessage({id: 'app.global.confirm'}),
           message: msg,
           confirmText: intl.formatMessage({id: 'app.global.yes'}),
           cancelText: intl.formatMessage({id: 'app.global.no'})
       }); 
     
      if(conf)
      {       
        dispatch(requestRemoveLibraryPendingOperator(match.params.library_id,pendingid,intl.formatMessage({id: "app.global.deletedMessage"})))
      }    
}

  

  

  return (            
      <PendingOperatorsList auth={props.auth} loading={isLoading} data={pending_operators} deleteOpCallback={(p)=>removePendingOperator(p)}/> 
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

export default compose(withConnect)(LibraryPendingOperatorsPage);

