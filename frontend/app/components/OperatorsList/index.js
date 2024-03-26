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
import Operator from '../Operator';
import { generatePath } from "react-router";

export const editurl=(reqPath,userid) => {
    return generatePath(reqPath, {
        userid,        
    });
}

const OperatorsList = (props) => {
    const {loading,auth, searchBox=true,data,editOpPath, deleteOpCallback} = props

    const filter=[];
    const intl = useIntl()

    

    console.log('OperatorsList', props)

    

    const [Filter, setFilter ] = useState(
        {
            query: '',            
        }
    );

    const canEditOrDelete = (userid) => {
        return (userid!=auth.user.id || (auth.permissions.roles.includes("super-admin") || auth.permissions.roles.includes("manager")))
    }





    return (
    <div className="operatorsList card">   
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
                                <Operator 
                                    key={`oper-${op.user_id}`}
                                    data={op}
                                    enableEdit={canEditOrDelete(op.user_id)}
                                    enableDelete={canEditOrDelete(op.user_id)}
                                    editPath={editurl(editOpPath,op.user_id)}   
                                    deleteOpCallback={()=>deleteOpCallback(op.user_id)}                                    
                                />                                                                                                
                            ))
                        ||
                            <h5 className="text-center">
                                {intl.formatMessage(messages.OperatorsNotFound)}
                            </h5>
                        }
                    </div>
                </Loader>
            </Col>
        </Row>

    </div>



    )
} 

export default OperatorsList