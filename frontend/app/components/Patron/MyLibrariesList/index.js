import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Form/Loader';
import MyLibraryItem from '../MyLibraryItem';
import { FormattedMessage } from 'react-intl';

const MyLibrariesList = props => {
    const { loading, data, pagination, messages, setFavorite, deleteCallback } = props
    
    return (
        <>
            <div className="section-title">
                <h1 className="large"><FormattedMessage {...messages.header} /></h1>
            </div>  
            <div className="myLibrariesList list-wrapper">
                <Loader show={loading}>
                    <div className="list-body">
                        {data.length > 0 &&
                            data.map(lib => (
                                <MyLibraryItem 
                                    key={`my-library-${lib.id}`}
                                    data={lib}
                                    editPath={props.editPath}
                                    setFavorite={() => setFavorite({preferred: !lib.preferred}, lib.library_id, lib.id)}
                                    deleteCallback={() => deleteCallback(lib.library_id, lib.id)}
                                    //editPath={props.editPath}
                                    /* toggleSelection={() => toggleReference(ref.id)}
                                    removeLabel={(labelId) => removeLabelFromReference(ref.id,labelId, multiFilter)}
                                    removeGroup={(groupId) => removeGroupFromReference(ref.id,groupId, multiFilter)}
                                    deleteReference={() => deleteReference(ref.id,multiFilter)}
                                    checked={selectedReferences.includes(ref.id)} */
                                />
                                
                                
                            ))
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