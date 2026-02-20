/*
 * LibraryInviteOperatorPage
 */

import React, {useEffect,useState} from 'react';
import {createStructuredSelector} from "reselect";
import makeSelectLibrary,{isLibraryLoading} from "../selectors";
import {compose} from "redux";
import { connect } from 'react-redux';
import {requestGetUsersOptionItems,requestInviteLibraryOperator, requestGetUserLibraryAbilities, requestClearUserLibraryAbilities} from '../actions';
import { makeSelectUserLibraryAbilities } from '../selectors';
import OperatorsList from '../../../components/OperatorsList';
import confirm from "reactstrap-confirm";
import {useIntl} from 'react-intl';
import LibraryInviteOperator from '../../../components/Library/LibraryInviteOperator';


function LibraryInviteOperatorPage(props) {
  console.log('LibraryInviteOperatorPage', props)
  const {isLoading, match, dispatch,library,auth   } = props;
    
  
  const intl = useIntl();

  const searchUserCallback=(q)=>{dispatch(requestGetUsersOptionItems(q))}

 const inviteCb=(opdata)=>{      
  dispatch(requestInviteLibraryOperator(match.params.library_id,opdata,intl.formatMessage({id: "app.containers.LibraryInviteOperatorPage.inviteSentMessage"})))
 }

 const filterLendPerm=(permsList) => {    
  if(permsList && library.library.profile_type==1) //only borrow library
  {
    let entries = Object.entries(permsList);
    let permsListentries=entries.filter(([key,value])=>key!='lend') //remove lend perm
    permsList=Object.fromEntries(permsListentries);
  }  
  return permsList;
 }

 
  return (
          <LibraryInviteOperator history={props.history} filterPerm={(permList)=>filterLendPerm(permList)} auth={auth} usersData={library.searchUsersOptionList} searchUserCallback={(q)=>searchUserCallback(q)} inviteOpCallback={(opdata)=>inviteCb(opdata)} libraryId={match.params.library_id} userLibraryAbilitiesData={props.userLibraryAbilitiesData} onGetUserAbilities={props.onGetUserAbilities} onClearUserAbilities={props.onClearUserAbilities}/>

  ); 
}

const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  isLoading: isLibraryLoading(),
  userLibraryAbilitiesData: makeSelectUserLibraryAbilities()
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  onGetUserAbilities: (libraryId, userId) => dispatch(requestGetUserLibraryAbilities(libraryId, userId)),
  onClearUserAbilities: () => dispatch(requestClearUserLibraryAbilities())
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LibraryInviteOperatorPage);