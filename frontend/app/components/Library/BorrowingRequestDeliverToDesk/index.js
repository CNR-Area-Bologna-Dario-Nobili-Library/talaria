import React,{useEffect} from 'react';
import {Card, Form as FormContainer, FormGroup, Button} from 'reactstrap';
import Input from '../../Form/Input';
import {useIntl} from 'react-intl';
import './style.scss';
import { useState } from "react";
import {canPatronReqDirectManaged,hasBeenDownloaded,isFile,isMail,isURL,isFAX,isArticleExchange,isOther, deliveryMethod} from '../BorrowingItem'
import FileUpload from '../../../containers/FileUpload';
import RadioButton from '../../Form/RadioButton';

const BorrowingRequestDeliverToDesk = props => {
    console.log('BorrowingRequestDeliverToDesk', props)
    const {data,deliverCallback}=props

    const intl = useIntl()

    const [submitEnable, setSubmitEnable]=useState(false);
    const [fileUploadStatus,setFileUploadStatus]=useState(null)    
    const [deliveryMethod,setDeliveryMethod]=useState(null)

    const [formData,setFormData]=useState({        
        desk_delivery_format:null,           
    });

    useEffect(() => {        
        if(fileUploadStatus && fileUploadStatus.status=="uploaded")
        {
            setFormData({
                ...formData,
                'filehash':fileUploadStatus.data,
                'filename':fileUploadStatus.originalfilename,
                'desk_delivery_format':1
            })                        
            setSubmitEnable(true) 
        }
    }, [fileUploadStatus])

       
    const handleChange = (value, field_name) =>{
        setFormData({ ...formData, [field_name]: value});                     
    }    

    const setDeskDeliveryType=(ty) => {                 
        handleChange(ty,'desk_delivery_format');  //1=file, 2=paper         
        setSubmitEnable(true) 
    }

    const addFileToRequest = (uploadstatus) => {                
        //console.log("addFileToRequest",uploadstatus)  
        setFileUploadStatus(uploadstatus)        
    }

    const setDeliveryRadio = (ty) => {
        setSubmitEnable(false);
        setDeliveryMethod(ty)
    }

    const setPaperDelivery = () => {
        setDeliveryRadio(2)
        setDeskDeliveryType(2)
    }

    //nothing to do cause file was already uploaded by lender
    const forwardFileToDesk= () => {
        setDeskDeliveryType(1);
    }

    const onSubmit=(e)=>{                         
        e.preventDefault();   
        //console.log("SUBMIT",formData)
        deliverCallback(formData)
    }

    
return (<div>
    <FormContainer onSubmit={onSubmit} className="was-validated" noValidate>                
                            <Card>
                                    {(canPatronReqDirectManaged(data) || ( isMail(data)||(isURL(data) && hasBeenDownloaded(data))||isFAX(data)||isArticleExchange(data)||isOther(data)) )&&
                                    <>
                                        <FormGroup >
                                            <RadioButton 
                                                                    label={intl.formatMessage({ id: "app.components.BorrowingRequestDeliveryToDesk.fileDeliveryMethod"})}
                                                                    checked={deliveryMethod === 1 ? true : false}
                                                                    handleChange={(e) => e.target.checked ? setDeliveryRadio(1):null }
                                            />                                                                
                                            {deliveryMethod==1 && <FileUpload parentCallback={addFileToRequest} data={data} customClass="detail-body"/>}                                            
                                        </FormGroup>
                                                                                                                                                                                  
                                        <FormGroup >                                            
                                            <RadioButton 
                                                                    label={intl.formatMessage({ id: "app.components.BorrowingRequestDeliveryToDesk.paperDeliveryMethod"})}
                                                                    checked={deliveryMethod === 2 ? true : false}
                                                                    handleChange={(e) => e.target.checked ? setPaperDelivery():null }
                                            />                                       
                                        </FormGroup>
                                    </>
                                    }
                                    {isFile(data) && hasBeenDownloaded(data) && <FormGroup>                                        
                                        <div className="d-flex justify-content-between">                                        
                                            <Button type="button" disabled={submitEnable} onClick={(e)=>forwardFileToDesk()} className="mt-0" color="info">
                                            {intl.formatMessage({ id: "app.components.BorrowingRequestDeliveryToDesk.forwardFileToDesk"})}
                                            </Button> 
                                        </div>
                                    </FormGroup>}                                                                  
                            </Card>
                            {(deliveryMethod==1 || deliveryMethod==2 || ( isFile(data) && hasBeenDownloaded(data) ) ) && 
                                <div className="d-flex justify-content-between">                                        
                                            <Button type="submit" className="mt-0" color="info" disabled={!submitEnable}>
                                                {intl.formatMessage({id:"app.requests.sendToDesk"})}
                                            </Button> 
                                </div>  
                            }
                            </FormContainer>
    
    </div>);

}

export default BorrowingRequestDeliverToDesk;