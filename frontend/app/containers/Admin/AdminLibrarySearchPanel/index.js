import React, {useEffect} from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import {requestGetCountriesOptionList, requestLibrarySubjectOptionList,requestGetInstitutionTypeOptionList,requestGetlibraryIdentifiersOptionList
/*requestGetlibraryIdentifiersOptionList*/} from '../actions'
import makeSelectAdmin, {isAdminLoading} from '../selectors';
import {LibrarySearchForm, Loader} from 'components';
import {fields} from './fields';



function AdminLibrarySearchPanel(props) {
    const intl = useIntl();
    const {dispatch, searchCallback,admin} = props    
             
    useEffect(() => {      
            dispatch(requestGetCountriesOptionList())
            dispatch(requestGetInstitutionTypeOptionList())         
            dispatch(requestLibrarySubjectOptionList())   
            dispatch(requestGetlibraryIdentifiersOptionList())                                   
    }, []) 

    return (
            <LibrarySearchForm 
                searchFields={fields}
                searchCallback={(params)=>searchCallback(params)} 
                institutionTypesOptionList={admin.institutionTypesOptionList}
                countriesOptionList={admin.countriesOptionList}
                subjectOptionList={admin.librarySubjectOptionList}   
                identifierTypesOptionList={admin.identifiersOptionList}             
            />
    )        
}



const mapStateToProps = createStructuredSelector({    
    admin: makeSelectAdmin()
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
  
export default compose(withConnect)(AdminLibrarySearchPanel);