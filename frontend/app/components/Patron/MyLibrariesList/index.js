import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Form/Loader';
import MyLibraryItem from '../MyLibraryItem';
import { FormattedMessage } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import { useIntl } from 'react-intl';
import { Row, Col} from 'reactstrap';

const MyLibrariesList = props => {
    const { loading, data, pagination, messages,preferred, setPreferred, deleteCallback } = props
    const intl=useIntl();

    return (
        <>
            <SectionTitle 
                title={messages.header}
            />
            <div className="myLibrariesList list-wrapper">
                <Loader show={loading}>
                    <div className="list-body">
                        {data.length > 0 &&
                        <>
                        <Row className="row my-libraries-item justify-content-between">
                            <Col sm={3} className="">
                                <p className="font-weight-bold">{intl.formatMessage({id:'app.global.status'})} </p>                                                                
                            </Col>
                            <Col sm={4} className="info">
                                <p className="font-weight-bold">{intl.formatMessage({id:'app.global.library'})} </p>                            
                            </Col>
                            <Col sm={3} className="info">    
                                <p  className="font-weight-bold">{intl.formatMessage({id:'app.containers.MyLibrariesPage.details'})}</p>             
                            </Col>
                            <Col sm={2} className="icons align-self-center">        
                            <p  className="font-weight-bold">{intl.formatMessage({id:'app.global.actions'})}</p>                                          
                            </Col>  
                        </Row>                        
                            {data.map(lib => (                                
                                <MyLibraryItem 
                                    key={`my-library-${lib.id}`}
                                    data={lib}
                                    editPath={props.editPath}
                                    setPreferred={() => setPreferred(lib.id,lib.library_id)}
                                    preferred={preferred}
                                    deleteCallback={() => deleteCallback(lib.library_id, lib.id)}
                                    //editPath={props.editPath}
                                    /* toggleSelection={() => toggleReference(ref.id)}
                                    removeLabel={(labelId) => removeLabelFromReference(ref.id,labelId, multiFilter)}
                                    removeGroup={(groupId) => removeGroupFromReference(ref.id,groupId, multiFilter)}
                                    deleteReference={() => deleteReference(ref.id,multiFilter)}
                                    checked={selectedReferences.includes(ref.id)} */
                                />
                                
                                
                            ))}
                        </>
                        ||
                            <h5 className="text-center">
                                <FormattedMessage {...messages.librariesNotFound} />
                            </h5>
                        }
                    </div>
                </Loader>
            </div>
        </>
    );
};

MyLibrariesList.propTypes = {
    
};

export default MyLibrariesList;