import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useIntl } from 'react-intl';
import './style.scss';
import SectionTitle from 'components/SectionTitle';
import InputSearch from 'components/Form/InputSearch';
import Loader from 'components/Form/Loader';
import messages from './messages';
import PendingOperator from '../PendingOperator';

const PendingOperatorsList = props => {
  const {
    loading,
    auth,
    searchBox = true,
    data,
    deleteOpCallback,
    acceptOpCallback,
    rejectOpCallback,
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

    const user_name = op.user ? (op.user.data.name || "") : (op.user_name || "");
    const user_surname = op.user ? (op.user.data.surname || "") : (op.user_surname || "");
    const user_email = op.user ? (op.user.data.email || "") : (op.user_email || "");

    return (
      (user_name !== null && user_name.match(reg) !== null) ||
      (user_surname !== null && user_surname.match(reg) !== null) ||
      (user_email !== null && user_email.match(reg) !== null)
    );
  };

  //only commmanager+library man can edit temp permission of any users (only other perm, not mine)
  const canEditOrDelete = tempop => {
    let userid = tempop.user ? tempop.user.data.id : tempop.user_id;
    let useremail = tempop.user ? tempop.user.data.email : tempop.user_email;    
    return ( ( ( (userid != null && userid != auth.user.id) || auth.user.email != useremail) && !auth.permissions.roles.includes("super-admin") ) || 
    ( ( (userid != null && userid != auth.user.id) || auth.user.email != useremail) && auth.permissions.roles.includes("manager"))) 
  };

  return (
    <div className="pendingoperatorsList card">
      <SectionTitle title={messages.header} />
      <Row>
        <Col md={6} sm={12}>
          {searchBox && (
            <InputSearch
              submitCallBack={query => {
                if (query !== '')
                  setFilter(state => ({
                    filterData: data.filter(op => OpMatch(op, query)),
                    query: query,
                  }));
                else
                  setFilter(state => ({
                    query: '',
                    filterData: data, // Reset to original data when query is empty
                  }));
              }}
              query={Filter.query}
              searchOnChange={true}
              clearButton={false}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Loader show={loading}>
            <div className="list-body">
              <div className="container" style={{ marginTop: '30px' }}>
                <div className="div-table">
                  <div className="div-table-row div-table-header">
                    <div className="div-table-cell" style={{ width: '25%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.name'})}
                    </div>
                    <div className="div-table-cell" style={{ width: '19%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.permissions'})}
                    </div>
                    <div className="div-table-cell" style={{ width: '10%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.status'})}
                    </div>
                    <div className="div-table-cell" style={{ width: '13%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.created_at'})}
                    </div>
                    <div className="div-table-cell" style={{ width: '13%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.updated_at'})}
                    </div>
                    <div className="div-table-cell" style={{ width: '20%', fontWeight: 'bold' }}>
                    {intl.formatMessage({id: 'app.global.actions'})}
                    </div>
                  </div>
                  {(Filter.filterData &&
                    Filter.filterData.length > 0 &&
                    Filter.filterData.map(op => (
                      <PendingOperator
                        key={`pendingoper-${op.id}`}
                        data={op}
                        enableDelete={canEditOrDelete(op)}
                        deleteOpCallback={() => deleteOpCallback(op.id)}
                        acceptOpCallback={() => acceptOpCallback(op.id)}
                        rejectOpCallback={() => rejectOpCallback(op.id)}
                        auth={auth}
                      />
                    ))) || (
                    <h5 className="text-center">
                      {intl.formatMessage(messages.PendingOperatorsNotFound)}
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

export default PendingOperatorsList;
