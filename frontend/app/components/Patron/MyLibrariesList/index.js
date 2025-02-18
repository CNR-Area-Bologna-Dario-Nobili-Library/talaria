import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/Form/Loader';
import MyLibraryItem from '../MyLibraryItem';
import { FormattedMessage } from 'react-intl';
import SectionTitle from 'components/SectionTitle';
import { useIntl } from 'react-intl';
import { Row, Col } from 'reactstrap';

const MyLibrariesList = props => {
  const {
    loading,
    data,
    pagination,
    messages,
    preferred,
    setPreferred,
    deleteCallback,
  } = props;
  const intl = useIntl();

  return (
    <>
      <SectionTitle title={messages.header} />
      <div className="myLibrariesList list-wrapper">
        <Loader show={loading}>
          <div className="list-body">
            {(data.length > 0 && (
              <>
                <Row className="d-none d-md-flex align-items-center font-weight-bold py-2">
                  <Col xs={12} md={3} className="d-flex align-items-center">
                    {intl.formatMessage({ id: 'app.global.status' })}
                  </Col>
                  <Col xs={12} md={4} className="d-flex align-items-center">
                    {intl.formatMessage({ id: 'app.global.library' })}
                  </Col>
                  <Col xs={12} md={3} className="d-flex align-items-center">
                    {intl.formatMessage({ id: 'app.containers.MyLibrariesPage.details' })}
                  </Col>
                  <Col xs={12} md={2} className="text-center">
                    {intl.formatMessage({ id: 'app.global.actions' })}
                  </Col>
                </Row>
                {data.map(lib => (
                  <MyLibraryItem
                    key={`my-library-${lib.id}`}
                    data={lib}
                    editPath={props.editPath}
                    setPreferred={() => setPreferred(lib.id, lib.library_id)}
                    preferred={preferred}
                    deleteCallback={() =>
                      deleteCallback(lib.library_id, lib.id)
                    }
                    //editPath={props.editPath}
                    /* toggleSelection={() => toggleReference(ref.id)}
                                    removeLabel={(labelId) => removeLabelFromReference(ref.id,labelId, multiFilter)}
                                    removeGroup={(groupId) => removeGroupFromReference(ref.id,groupId, multiFilter)}
                                    deleteReference={() => deleteReference(ref.id,multiFilter)}
                                    checked={selectedReferences.includes(ref.id)} */
                  />
                ))}
              </>
            )) || (
              <h5 className="text-center">
                <FormattedMessage {...messages.librariesNotFound} />
              </h5>
            )}
          </div>
        </Loader>
      </div>
    </>
  );
};

MyLibrariesList.propTypes = {};

export default MyLibrariesList;
