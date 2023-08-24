import React,{useState,useEffect} from 'react';
import {FormattedHTMLMessage, useIntl} from 'react-intl';
import {Form as FormContainer, FormGroup, Button} from 'reactstrap';
import {Pagination} from 'components';
import CustomCheckBox from '../../Form/CustomCheckBox';
import Input from '../../Form/Input';
import LibraryInformations from '../LibraryInformations';
import LibrarySearchPanel from '../../../containers/Library/LibrarySearchPanel'

import './style.scss';

const BorrowingChooseLender = (props) => {
    console.log('BorrowingChooseLender', props)
    const catalog_filter_enabled=(process.env.CATALOG_SEARCH && process.env.CATALOG_SEARCH=="true")?true:false;
    const {selectLenderCb,findLender,lendersList,pagination} = props
    const intl = useIntl()

    const {total_pages, current_page,total,count,per_page} = pagination

    const [allselected,setAllSelected]=useState(false);

    //const [lender,setLender]=useState(null)

    const [formData,setFormData]=useState({
        borrowing_protnr:'',
        request_special_delivery: 0,
        request_pdf_editorial:0,
        lending_library_id: null
    });

    const [searchParams,setSearchParams]=useState({
        page: 1,
        pageSize:20,        
    })

    const handleChange = (value, field_name) =>{
        setFormData({ ...formData, [field_name]: value});        
    } 

    const setLender = (lender) => {
        //set it as array or 0 (=all lender)

        let lenderArr=lender;        
        
        if(lenderArr && lenderArr>0 && !Array.isArray(lenderArr)) //unique lender
            lenderArr=[lender];  
        
        setFormData({ ...formData, lending_library_id: lenderArr[0]}) //ATTUALMENTE PRENDO SOLO 1 BIBLIO   
    }


    const onSubmit=(e)=>{     
                
            e.preventDefault();
            /*const form = e.target;
            if (form.checkValidity() === false) {
                console.log("Dont Send Form")
                const errorTarget = document.querySelectorAll('.was-validated .form-control:invalid')[0]
                scrollTo(errorTarget.offsetParent, true)
                
                return
            } else {
                // Tutto ok invia Form!
                selectLenderCb(formData)
                console.log("Send Form", formData)
            }*/
            selectLenderCb(formData)
    }

    const onChangeLibraryList=(v)=>{
        setAllSelected(v==0);        
        setLender(v)
    }

    const findLenderByCat=(catid) => {
        //todo: select catalog
        //call findLender api (filtered by cat or ALL)
        //findLender(catid);
    }

    const doSearch = (params) => {
        setSearchParams( state => ({
            ...state,
            ...params
        }));        
    }


    useEffect(() => {
        //findLenderByCat(0)        
        findLender(searchParams)
    }, [searchParams])

    return (<div className="BorrowingChooseLender">
                <h3>{intl.formatMessage({id: 'app.requests.borrowing_lender_list_title'})}</h3>                                                          
                <ul className="nav nav-tabs" id="LenderListTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="alllist-tab" data-toggle="tab" role="tab" aria-controls="alllist" aria-selected="true" data-target="#alllist">ALL</button>
                    </li>                      
                    <li className={`nav-item ${!catalog_filter_enabled?'disabled':''}`} role="presentation">
                        <button className="nav-link" id="cat1list-tab" data-toggle="tab" role="tab" aria-controls="cat1list" aria-selected="false"  data-target="#cat1list">CATALOG1</button>
                    </li>
                    <li className={`nav-item ${!catalog_filter_enabled?'disabled':''}`} role="presentation">
                        <button className="nav-link" id="cat2list-tab" data-toggle="tab" role="tab" aria-controls="cat2list" aria-selected="false" data-target="#cat2list">CATALOG2</button>
                    </li>                      
                </ul>                
                <div className='tab-content' id="LenderListTabContent">                       
                    <div className="tab-pane fade show active" id="alllist" role="tabpanel" aria-labelledby="alllist-tab">      
                    <div className='' id="LibrariesListResult">
                        <LibrarySearchPanel searchCallback={(filters)=>doSearch({page:1,pageSize:15,...filters})}/>
                        {lendersList.loading && <div className="w-50 mx-auto my-3 text-center"><i className="fa-solid fa-spinner fa-spin-pulse fa-2x"></i></div>}
                        {lendersList.data && lendersList.data.length>0 &&
                        <>                    
                            {Object.keys(pagination).length>0 &&
                                <Pagination
                                    total={total}
                                    count={count}
                                    per_page={per_page}
                                    current_page={current_page}
                                    total_pages={total_pages}
                                    linkToPage={(page, pagesize) => 
                                        doSearch(
                                        { 
                                            page,
                                            pageSize:pagesize
                                        } 
                                    )}
                                />    
                            }
                            <ul className="librarylist">
                                <li key="alllibraries" className="alllibraries"><input name="lender" type="radio" value="0" onChange={e=>onChangeLibraryList(e.target.value)} /> <i className="fa-solid fa-cloud"></i> {intl.formatMessage({id: "app.global.alllibraries"})}</li>
                                {lendersList.data.map ( (lib) => 
                                    <li key={lib.id}><input name="lender" type="radio" value={lib.id} onChange={e=>onChangeLibraryList(e.target.value)} />
                                        <LibraryInformations data={lib} showILLInfo={true}/>
                                    </li>    
                                )}                                        
                            </ul>                                                                  
                        </>}
                        {Object.keys(pagination).length>0 &&
                                <Pagination
                                    total={total}
                                    count={count}
                                    per_page={per_page}
                                    current_page={current_page}
                                    total_pages={total_pages}
                                    linkToPage={(page, pagesize) => 
                                        doSearch(
                                        { 
                                            page,
                                            pageSize:pagesize
                                        } 
                                    )}
                                />    
                        }
                        </div>
                        {(allselected || (formData.lending_library_id && !allselected) ) && 
                            <div className="requestFieldsBlock">  
                                <FormContainer onSubmit={onSubmit} className="was-validated" noValidate>                                            
                                    <FormGroup >
                                        <Input 
                                            label={intl.formatMessage({id: "app.requests.borrowing_protnr"})}
                                            handleChange={(value) => handleChange(value, 'borrowing_protnr')}
                                            required={false}
                                            input={formData.borrowing_protnr ? formData.borrowing_protnr : ""}
                                        />
                                    </FormGroup>
                                    <FormGroup >
                                        <CustomCheckBox
                                            label={intl.formatMessage({id: "app.requests.request_special_delivery"})} 
                                            checked={formData.request_special_delivery === 1 ? true : false}
                                            handleChange={(e) =>  handleChange(e.target.checked?1:0, 'request_special_delivery')}
                                        />
                                    </FormGroup>
                                    <FormGroup >
                                        <CustomCheckBox
                                            label={intl.formatMessage({id: "app.requests.request_pdf_editorial"})} 
                                            checked={formData.request_pdf_editorial === 1 ? true : false}
                                            handleChange={(e) =>  handleChange(e.target.checked?1:0, 'request_pdf_editorial')}
                                        />
                                    </FormGroup>                            
                                    <FormGroup>
                                        <Input 
                                            label={intl.formatMessage({id: "app.requests.request_note"})}
                                            handleChange={(value) => handleChange(value, 'request_note')}
                                            input={formData.request_note ? formData.request_note : ""}
                                            type="textarea"
                                            required={false}
                                        />
                                    </FormGroup>
                                    <div className="alert alert-primary copyrightstatement">                                                
                                                <FormattedHTMLMessage id="app.requests.borrowingCopyrightStatement" defaultMessage="borrowingCopyrightStatement" />
                                    </div>                                
                                    {allselected && 
                                        <div className="alert alert-warning">
                                            <i className="fa-solid fa-triangle-exclamation"></i> 
                                            <FormattedHTMLMessage id="app.requests.sendToAllLibrariesWarning"/>
                                        </div>                                
                                    }                                                                               
                                    <div className="d-flex justify-content-between sendTolenderButtons">                                        
                                        <Button type="submit" className="mt-0" color="warning">
                                            {intl.formatMessage({id:"app.requests.sendRequest"})}
                                        </Button>                         
                                    </div>                            
                                </FormContainer>
                            </div>                     
                        }  
                    </div>
                    <div class="tab-pane fade" id="cat1list" role="tabpanel" aria-labelledby="cat1list-tab">empty list</div>
                    <div class="tab-pane fade" id="cat2list" role="tabpanel" aria-labelledby="cat2list-tab">empty list</div>                        
                </div>
            </div>
    );
};

export default BorrowingChooseLender;