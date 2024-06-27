import React, {useEffect, useState} from 'react'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {useIntl} from 'react-intl';
import {requestGetLibraryOperators, requestRemoveLibraryOperator, requestGetLibrary} from '../actions'
import makeSelectAdmin, {isAdminLoading} from '../selectors';
import messages from './messages'
import confirm from "reactstrap-confirm";
import OperatorsList from '../../../components/OperatorsList';
import SectionTitle from 'components/SectionTitle';

// import queryString from 'query-string'

const AdminLibraryOperatorsPage = (props) => {
    
console.log('AdminLibraryOperatorsPage', props)
const {isLoading, match, dispatch,admin} = props;


const operators=admin.operators

const lib=admin.library

const editOpPath='/admin/libraries/'+match.params.library_id+"/operators/:userid?/edit";

const intl = useIntl();


useEffect(() => {         
    if(!isLoading){  
        dispatch(requestGetLibrary(match.params.library_id))      
        dispatch(requestGetLibraryOperators(match.params.library_id)) 
    }}, [match.params.library_id])



    async function removeOperator(userid) {          
    
    let msg=intl.formatMessage({id: "app.containers.AdminLibraryOperatorsPage.askRemoveOperatorMessage"})
    
    
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
        <>
            {lib && <h2>{lib.name}</h2>}                            
            <OperatorsList auth={props.auth} loading={isLoading} data={operators} editOpPath={editOpPath} deleteOpCallback={(u)=>removeOperator(u)}/>        
        </>        
)

}
const mapStateToProps = createStructuredSelector({
admin: makeSelectAdmin(),
isLoading: isAdminLoading(),
});

const mapDispatchToProps = (dispatch) => ({
dispatch,
})

const withConnect = connect(
mapStateToProps,
mapDispatchToProps,
);

export default compose(withConnect)(AdminLibraryOperatorsPage);
