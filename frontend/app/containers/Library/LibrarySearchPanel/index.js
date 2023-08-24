import React, {useEffect,useState} from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import {requestGetCountriesOptionList, requestLibrarySubjectOptionList,requestGetInstitutionTypesOptionList,requestLibraryIdentifierTypesOptionList
/*requestGetlibraryIdentifiersOptionList*/} from '../actions'
import makeSelectLibrary, {isLibraryLoading} from '../selectors';
import {LibrarySearchForm, Loader} from 'components';
import {fields} from './fields';



function LibrarySearchPanel(props) {
    const intl = useIntl();
    const {dispatch, searchCallback,library} = props    
         
    useEffect(() => {              
            dispatch(requestGetCountriesOptionList())
            dispatch(requestGetInstitutionTypesOptionList())         
            dispatch(requestLibrarySubjectOptionList())   
            dispatch(requestLibraryIdentifierTypesOptionList())             
    }, []) 

    return (        
            <LibrarySearchForm 
                searchFields={fields}
                searchCallback={(params)=>searchCallback(params)} 
                institutionTypesOptionList={library.institutionTypesOptionList}
                countriesOptionList={library.countriesOptionList}
                subjectOptionList={library.librarySubjectOptionList}   
                identifierTypesOptionList={library.libraryIdentifierTypesOptionList}             
            />
    )

        
}



const mapStateToProps = createStructuredSelector({    
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