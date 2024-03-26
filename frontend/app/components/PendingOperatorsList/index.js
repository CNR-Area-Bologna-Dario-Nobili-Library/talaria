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

    const filter=[];
    const intl = useIntl()

    console.log('PendingOperatorsList', props)

    

    const [Filter, setFilter ] = useState(
        {
            query: '',            
        }
    );
    

    const canEditOrDelete = (tempop) => {
        let userid=tempop.user?tempop.user.data.id:tempop.user_id
        let useremail=tempop.user?tempop.user.data.email:tempop.user_email
        return ( ( (userid!=null && userid!=auth.user.id) && (auth.user.email!=useremail) ) || (auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager")))
    }




    return (
    <div className="pendingoperatorsList card">   
         <SectionTitle title={messages.header}/>
         <Row>
            <Col md={6} sm={12}>
                {searchBox && <InputSearch
                submitCallBack={(query) => { 
                    setFilter( state => ({
                        query:query,                        
                    }) )
                } 
                }
                query={Filter.query}
                //searchOnChange={searchOptions.searchOnChange ? searchOptions.searchOnChange : false}
                />}
            
                        </Col> 
        </Row>
        <Row>
            <Col>
                <Loader show={loading}>
                    <div className="list-body">
                        {data.length > 0 &&
                            data.map(op => (
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