import React, {useEffect} from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import {requestGetCountriesOptionList, requestLibrarySubjectOptionList,requestGetInstitutionTypeOptionList,requestGetlibraryIdentifiersOptionList
/*requestGetlibraryIdentifiersOptionList*/} from '../actions'
import makeSelectAdmin from '../selectors';
import {fields} from './fields';
import {InstitutionSearchForm} from 'components'



function AdminInstitutionSearchPanel(props) {
    const intl = useIntl();
    const {dispatch, searchCallback,admin} = props    
             
    useEffect(() => {      
            dispatch(requestGetCountriesOptionList())
            dispatch(requestGetInstitutionTypeOptionList())                                 
    }, []) 

    return (
            <InstitutionSearchForm
                searchFields={fields}
                searchCallback={(params)=>searchCallback(params)} 
                institutionTypesOptionList={admin.institutionTypesOptionList}
                countriesOptionList={admin.countriesOptionList}                                
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
  
export default compose(withConnect)(AdminInstitutionSearchPanel);