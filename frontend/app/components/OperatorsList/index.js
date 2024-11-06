import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useIntl } from 'react-intl';
import './style.scss';
import SectionTitle from 'components/SectionTitle';
import InputSearch from 'components/Form/InputSearch';
import Loader from 'components/Form/Loader';
import messages from './messages';
import Operator from '../Operator';
import { generatePath } from 'react-router';

export const editurl = (reqPath, userid) => {
  return generatePath(reqPath, {
    userid,
  });
};

const OperatorsList = props => {
  const {
    loading,
    auth,
    searchBox = true,
    data,
    editOpPath,
    deleteOpCallback,
  } = props;
  const intl = useIntl();

  const [Filter, setFilter] = useState({
    query: '',
    filterData: [],
  });

  useEffect(() => {
    if (data)
      setFilter(state => ({
        query: '',
        filterData: data,
      }));
  }, [data]);

  const OpMatch = (op, query) => {
    let reg = new RegExp(query, 'gi');

    return (
      op.name.match(reg) != null ||
      op.surname.match(reg) != null ||
      op.full_name.match(reg) != null ||
      op.email.match(reg) != null
    );
  };

  const canEditOrDelete = userid => {
    return (
      (userid != auth.user.id &&
        !auth.permissions.roles.includes('super-admin')) ||
      (userid != auth.user.id && auth.permissions.roles.includes('manager'))
    );
  };

  return (
    <div className="operatorsList card">
      <SectionTitle title={messages.header} />
      <Row>
        <Col md={6} sm={12}>
          {searchBox && (
            <div className="search-box">
              <InputSearch
                submitCallBack={query => {
                  if (query != '')
                    setFilter(state => ({
                      filterData: data.filter(op => OpMatch(op, query)),
                      query: query,
                    }));
                  else {
                    setFilter(state => ({
                      query: '',
                      filterData: data, // Reset to original data when query is empty
                    }));
                  }
                }}
                query={Filter.query}
                searchOnChange={true}
                clearButton={false}
              />
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Loader show={loading}>
            <div className="list-body">
              <div className="container" style={{ marginTop: '30px' }}>
                <div className="div-table">
                  <div className="div-table-row">
                    <div
                      className="div-table-header"
                      style={{ width: '25%', fontWeight: 'bold' }}
                    >
                     {intl.formatMessage({id: 'app.global.name'})}
                    </div>
                    <div
                      className="div-table-header"
                      style={{ width: '55%', fontWeight: 'bold' }}
                    >
                      {intl.formatMessage({id: 'app.global.permissions'})}
                    </div>
                    <div
                      className="div-table-header"
                      style={{ width: '20%', fontWeight: 'bold' }}
                    >
                     {intl.formatMessage({id: 'app.global.actions'})}
                    </div>
                  </div>
                  {Filter.filterData && Filter.filterData.length > 0 ? (
                    Filter.filterData.map(op => (
                      <Operator
                        key={`oper-${op.user_id}`}
                        data={op}
                        enableEdit={canEditOrDelete(op.user_id)}
                        enableDelete={canEditOrDelete(op.user_id)}
                        editPath={editurl(editOpPath, op.user_id)}
                        deleteOpCallback={() => deleteOpCallback(op.user_id)}
                      />
                    ))
                  ) : (
                    <h5 className="text-center">
                      {intl.formatMessage(messages.OperatorsNotFound)}
                    </h5>
                  )}
                </div>
              </div>
            </div>
          </Loader>
        </Col>
      </Row>
    </div>
  );
};

export default OperatorsList;
