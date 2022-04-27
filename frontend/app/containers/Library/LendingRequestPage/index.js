import React, {useEffect, useState} from 'react'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import makeSelectLibrary, {isLibraryLoading} from '../selectors';
import fileUploadNameSelector from '../selectors'
import {Loader} from 'components';
import LendingDetail from '../../../components/Library/LendingDetail';
import {requestLibraryTagsOptionList, requestGetLending, requestChangeStatusLending, requestuploadFile} from '../actions'
import messages from './messages';
import SectionTitle from 'components/SectionTitle';
import {useIntl} from 'react-intl';
import makeSelectReference from '../../Reference/selectors';
import { acceptallLenderLendingRequest } from '../../../utils/api';

const LendingRequestPage = (props) => {
    console.log('LendingRequestPage', props)
    const {dispatch, isLoading, match, library,reference, filename} = props
    const {params} = match       
    const intl = useIntl();
    const isNew = !params.id || params.id === 'new'    
    const isRequest = !isNew && params.id>0        
    const isEdit= params.id>0 && params.op && params.op==='edit' 
    const lending=library.lending
    const lendersList=library.libraryOptionList;
    const [isMounted, setIsMounted] = useState(false);    
    const [fileUploadname, setfileUploadName] = useState("");

    useEffect(() => {                
        setIsMounted(true)     
        if(props.isLogged){
            dispatch(requestLibraryTagsOptionList(match.params.library_id))
        }        
    }, [])


    useEffect(() => {       
        if(props.isLogged && isRequest){            
            dispatch(requestGetLending(params.id,match.params.library_id));
        }        
    }, [params.id])

    const FulfillLendingRequestStatus = (data, formdata) => {
        data.lending_status="copyCompleted";
        dispatch(requestChangeStatusLending(data.id, data.lending_library_id, data.lending_status, {filename:filename.fileupload.originalfilename,filehash: filename.fileupload.data, fulfill_type:formdata.fulfill_type, fulfill_note:formdata.fulfill_note, url:formdata.url}, intl.formatMessage({id: "app.requests.fulfilledMessage"}),""))
    }

    const unFulfillLendingRequestStatus = (data) => {
        data.lending_status="unFilled";
        dispatch(requestChangeStatusLending(data.id, data.lending_library_id, data.lending_status, "", intl.formatMessage({id: "app.requests.unFilledMessage"}),""))
    }

    const uploadFile = (data, selectedFile, originalfilename) => {
        dispatch(requestuploadFile(data.id, data.lending_library_id, selectedFile, originalfilename, data.lending_status,intl.formatMessage({id: "app.requests.unFilledMessage"}),""))
        setfileUploadName(filename.fileupload.data)
    }

    return (
        <Loader show={isLoading}>
            <div className="detail">
                <SectionTitle 
                    back={isNew?false:true}
                    title={isNew?messages.headerNew:messages.headerDetail}
                />            
                {(Object.keys(lending).length>0) &&                                 
                    <LendingDetail history={props.history} data={lending} uploadFile={uploadFile} uploadSuccessCallback={filename.fileupload.data} fileUploadStatus={filename.fileupload.status} FulfillLendingRequestStatus={FulfillLendingRequestStatus} unFulfillLendingRequestStatus={unFulfillLendingRequestStatus}  lendersList={lendersList} />                      
                }            
            </div>
        </Loader>
    )
}

const mapStateToProps = createStructuredSelector({
    isLoading: isLibraryLoading(),
    library: makeSelectLibrary(),
    reference: makeSelectReference(),
    filename: fileUploadNameSelector(),    
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
  
export default compose(withConnect)(LendingRequestPage);