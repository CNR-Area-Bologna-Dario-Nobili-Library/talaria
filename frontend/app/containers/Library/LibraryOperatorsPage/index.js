/*
 * LibraryCurrentOperatorsPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectLibrary,{isLibraryLoading} from "../selectors";
import {compose} from "redux";
import messages from './messages'
import { connect } from 'react-redux';
import {requestGetLibraryOperators,requestRemoveLibraryOperator} from '../actions';
import OperatorsList from '../../../components/OperatorsList';
import confirm from "reactstrap-confirm";
import {useIntl} from 'react-intl';


function LibraryOperatorsPage(props) {
  console.log('LibraryOperatorsPage', props)
  const {isLoading, match, dispatch,library   } = props;

  const operators=library.operators

  const editOpPath='/library/'+match.params.library_id+"/manage/operators/:userid?/edit";

  const intl = useIntl();

  
  useEffect(() => {         
    if(!isLoading){        
        dispatch(requestGetLibraryOperators(match.params.library_id)) 
    }}, [match.params.library_id])


 
    async function removeOperator(userid) {          
      
      let msg=intl.formatMessage({id: "app.containers.LibraryOperatorsPage.askRemoveOperatorMessage"})
      
      
      let conf = await confirm({
          title: intl.formatMessage({id: 'app.global.confirm'}),
           message: msg,
           confirmText: intl.formatMessage({id: 'app.global.yes'}),
           cancelText: intl.formatMessage({id: 'app.global.no'})
       }); 
     
      if(conf)
      {       
        dispatch(requestRemoveLibraryOperator(match.params.library_id,userid,intl.formatMessage({id: "app.global.deletedMessage"})))
      }    
}
  

  

  return (            
        <OperatorsList auth={props.auth} loading={isLoading} data={operators} editOpPath={editOpPath} deleteOpCallback={(u)=>removeOperator(u)}/>        
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

export default compose(withConnect)(LibraryOperatorsPage);

