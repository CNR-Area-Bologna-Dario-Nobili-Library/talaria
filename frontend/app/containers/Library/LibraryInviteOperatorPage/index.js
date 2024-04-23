/*
 * LibraryInviteOperatorPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectLibrary,{isLibraryLoading} from "../selectors";
import {compose} from "redux";
import messages from './messages'
import { connect } from 'react-redux';
import {requestGetUsersOptionItems,requestInviteLibraryOperator} from '../actions';
import OperatorsList from '../../../components/OperatorsList';
import confirm from "reactstrap-confirm";
import {useIntl} from 'react-intl';
import LibraryInviteOperator from '../../../components/Library/LibraryInviteOperator';


function LibraryInviteOperatorPage(props) {
  console.log('LibraryInviteOperatorPage', props)
  const {isLoading, match, dispatch,library   } = props;
  
  
  const intl = useIntl();

  const searchUserCallback=(q)=>{dispatch(requestGetUsersOptionItems(q))}

 const inviteCb=(opdata)=>{      
  dispatch(requestInviteLibraryOperator(match.params.library_id,opdata,intl.formatMessage({id: "app.containers.LibraryInviteOperatorPage.inviteSentMessage"})))
 }

  return (            
          <LibraryInviteOperator usersData={library.searchUsersOptionList} searchUserCallback={(q)=>searchUserCallback(q)} inviteOpCallback={(opdata)=>inviteCb(opdata)}/>

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

export default compose(withConnect)(LibraryInviteOperatorPage);

