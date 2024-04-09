import React, {useEffect, useState} from 'react'
import {Row, Col, Button} from 'reactstrap'
//import messages from './messages'
//import globalMessages from 'utils/globalMessages'
import { FormattedMessage } from 'react-intl';
import {useIntl} from 'react-intl';
import './style.scss';
import SectionTitle from 'components/SectionTitle';
import InputSearch from 'components/Form/InputSearch';
import Loader from 'components/Form/Loader';
import messages from './messages';
import PendingOperator from '../PendingOperator';
import { generatePath } from "react-router";

export const editurl=(reqPath,userid) => {
    return generatePath(reqPath, {
        userid,        
    });
}

const PendingOperatorsList = (props) => {
    const {loading,auth,searchBox=true,data, deleteOpCallback} = props

    const intl = useIntl()

    console.log('PendingOperatorsList', props)


    const [Filter, setFilter ] = useState(
        {
            query: '',  
            filterData:[]          
        }
    );

    useEffect(() => {
        if(data)
        setFilter(state=>(
            {
                query:state.query,
                filterData:data
            }))
    }, [data])

    const OpMatch=(op, query) => {
        let reg=new RegExp(query,"gi")

        const user_name=op.user?op.user.data.name:op.user_name
        const user_surname=op.user?op.user.data.surname:op.user_surname
        const user_email=op.user?op.user.data.email:op.user_email    
                
        return user_name.match(reg)!=null||
          user_surname.match(reg)!=null||        
          user_email.match(reg)!=null
    }
    

    const canEditOrDelete = (tempop) => {
        let userid=tempop.user?tempop.user.data.id:tempop.user_id
        let useremail=tempop.user?tempop.user.data.email:tempop.user_email
        return ( ( (userid!=null && userid!=auth.user.id) || (auth.user.email!=useremail) ) || (auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager")))
    }




    return (
    <div className="pendingoperatorsList card">   
         <SectionTitle title={messages.header}/>
         <Row>
            <Col md={6} sm={12}>
            {searchBox && <InputSearch
                submitCallBack={(query) => { 
                    if(query!='')
                        setFilter( state => ({                        
                            ...state,
                            filterData:state.filterData.filter(op=>{
                                return OpMatch(op,query)
                            }),
                            query:query,                        
                        }) )
                    else setFilter(state=>({
                        ...state,
                        query:'',
                        filterData:data,
                    })
                    )    
                } 
                }
                query={Filter.query}
                searchOnChange={false}
                clearButton={true}
                />}
            
                        </Col> 
        </Row>
        <Row>
            <Col>
                <Loader show={loading}>
                    <div className="list-body">
                        {Filter.filterData && Filter.filterData.length > 0 &&
                            Filter.filterData.map(op => (
                                <PendingOperator 
                                    key={`pendingoper-${op.id}`}
                                    data={op}   
                                    enableDelete={canEditOrDelete(op)}                                 
                                    deleteOpCallback={()=>deleteOpCallback(op.id)}                                    
                                />                                                                                                
                            ))
                        ||
                            <h5 className="text-center">
                                {intl.formatMessage(messages.PendingOperatorsNotFound)}
                            </h5>
                        }
                    </div>
                </Loader>
            </Col>
        </Row>

    </div>



    )
} 

export default PendingOperatorsList