import React from 'react';
import {useIntl} from 'react-intl';
import ReferenceDetailContent from '../../ReferenceDetailContent';
import FulfillLendingRequest from  '../FulfillLendingRequest';
import {LendingStatus} from '../LendingItem'
import RequestTags from '../RequestTags'
import './style.scss';
import {documentAccess} from '../LendingItem';

export const LendingRequestData = (props) => {
            const {data} = props
            const intl = useIntl()
        
            return (
            <div className="LendingRequestData">
                {(data.fulfill_location||data.request_note||
                data.request_special_delivery==1||data.request_pdf_editorial==1 ) && 
                <div className="borrowingRequestData">                      
                    {data.request_note && <span className="requestData"><span className="label">{intl.formatMessage({id: "app.requests.request_note"})}: </span>{data.request_note} </span>}
                    {data.request_special_delivery==1 && <span className="requestData"><i className="fa-solid fa-square-check"></i> <span className="label">{intl.formatMessage({id: "app.requests.request_special_delivery"})} </span></span>}
                    {data.request_pdf_editorial==1 &&  <span className="requestData"><i className="fa-solid fa-square-check"></i> <span className="label">{intl.formatMessage({id: "app.requests.request_pdf_editorial"})}</span></span>}                
                
                    {data.fulfill_location &&
                    <div className="shelflocation">
                        <span className="requestData"><span className="label"><i className="fa-solid fa-thumbtack"></i> {intl.formatMessage({id: "app.requests.fulfill_location"})}: </span>{data.fulfill_location} </span>
                    </div>}
                </div>}

                {(data.lending_notes||data.lending_protnr||data.fulfill_note||data.fulfill_inventorynr) && <div className="lendingData">  
                    {data.lending_notes && <span className="requestData"><span className="label">{intl.formatMessage({id: "app.requests.lending_notes"})}: </span>{data.lending_notes} </span>}
                    {data.lending_protnr && <span className="requestData"><span className="label">{intl.formatMessage({id: "app.requests.lending_protnr"})}: </span>{data.lending_protnr} </span>}
                    {data.fulfill_note && <span className="requestData"><span className="label">{intl.formatMessage({id: "app.requests.fulfill_note"})}: </span>{data.fulfill_note} </span>}
                    {data.fulfill_inventorynr && <span className="requestData"><span className="label">{intl.formatMessage({id: "app.requests.fulfill_inventorynr"})}: </span>{data.fulfill_inventorynr} </span>}
                </div>}
            </div>
        
            )
        }         

const LendingDetail = (props) => {
    console.log('LendingDetail', props)
    const {data, FulfillLendingRequestStatus, unFulfillLendingRequestStatus} = props
    const intl = useIntl()

return (<div className="lendingDetail">
                <RequestTags data={data.tags.data} /> 
                <div className="lendingTracking detail-body">
                <h3>{intl.formatMessage({id: "app.requests.status"})}</h3>
                    <div className="card">                                    
                        <LendingStatus data={data}/>
                        {documentAccess(data)}
                        <LendingRequestData data={data}/>
                    </div>  
                </div>                  
                <ReferenceDetailContent reference={data.reference.data} customClass="detail-body" canCollapse={true} collapsed={true}/>                                
                {(data.lending_status==='willSupply'||data.lending_status==='requestReceived'||data.lending_status=='cancelRequested') &&               
                <FulfillLendingRequest FulfillLendingRequestStatus={FulfillLendingRequestStatus} unFulfillLendingRequestStatus={unFulfillLendingRequestStatus} data={data} customClass="detail-body"/>}
    </div>
    );
};

export default LendingDetail;