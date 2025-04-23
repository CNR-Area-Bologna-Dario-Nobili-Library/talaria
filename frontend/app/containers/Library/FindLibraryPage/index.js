/*
 * FindLibraryPage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
import React, {useEffect,useState} from 'react';
import {compose} from "redux";
import { connect } from 'react-redux';
import {useIntl} from 'react-intl';
import {BasePage} from "components";
import { FindLibrary } from '../../../components/Library/FindLibrary';
import { makeSelectLibraryList } from '../selectors';
import { createStructuredSelector } from 'reselect';

import { requestLibraryOptionList, requestClearLibraryOptionList} from '../actions';


function FindLibraryPage(props) {
  console.log('FindLibraryPage', props)
  const {dispatch,auth,libraryList} = props;

  const intl = useIntl();

  const handleLibrarySearch = (query, action) => {
    if (action === 'clear') {
        dispatch(requestClearLibraryOptionList()); //dispatch is need since libraryList retains last search results when input is cleared.
    }
    if (action === 'input-change' && query.length >= 3) {
        dispatch(requestLibraryOptionList(query));
    }
  };
  
  

  

  return (    
      <BasePage {...props} routes={[]} headermenu={false}> 
          <h1 className="header">{intl.formatMessage({id:'app.containers.FindLibraryPage.header'})}</h1>      
          <p>{intl.formatMessage({id:'app.containers.FindLibraryPage.intro'})}</p>          
          <FindLibrary  auth={auth} libraryList={libraryList} onLibrarySearch={handleLibrarySearch}/>
      </BasePage>          
  );
}

const mapStateToProps = createStructuredSelector({
  libraryList: makeSelectLibraryList() 
});


const mapDispatchToProps = (dispatch) => ({
  dispatch,
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// export default withRouter(withGoogleReCaptcha((SignupForm)));
export default compose(withConnect)(FindLibraryPage);
