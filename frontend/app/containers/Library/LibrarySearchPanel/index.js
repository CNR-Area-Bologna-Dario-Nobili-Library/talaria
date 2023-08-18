import React, {useEffect,useState} from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import {requestGetCountriesOptionList, requestLibrarySubjectOptionList,requestGetInstitutionTypesOptionList,requestLibraryIdentifierTypesOptionList
/*requestGetlibraryIdentifiersOptionList*/} from '../actions'
import makeSelectLibrary, {isLibraryLoading} from '../selectors';
import {LibrarySearchForm, Loader} from 'components';




function LibrarySearchPanel(props) {
    const intl = useIntl();
    const {isLoading, dispatch, searchCallback,library} = props    
         
    useEffect(() => {      
        if(!isLoading) {
            dispatch(requestGetCountriesOptionList())
            dispatch(requestGetInstitutionTypesOptionList())         
            dispatch(requestLibrarySubjectOptionList())   
            dispatch(requestLibraryIdentifierTypesOptionList()) 
            }
    }, []) 

    return (
        <Loader show={isLoading}>
            <LibrarySearchForm 
                searchCallback={(params)=>searchCallback(params)} 
                institutionTypesOptionList={library.institutionTypesOptionList}
                countriesOptionList={library.countriesOptionList}
                subjectOptionList={library.librarySubjectOptionList}   
                identifierTypesOptionList={library.libraryIdentifierTypesOptionList}             
            />

        </Loader>
    )

        
}



const mapStateToProps = createStructuredSelector({
    isLoading: isLibraryLoading(),
    library: makeSelectLibrary(),    
});
  
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);
  
export default compose(withConnect)(LibrarySearchPanel);