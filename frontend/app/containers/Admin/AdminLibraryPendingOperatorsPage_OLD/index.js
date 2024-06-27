/*
 * LibraryPendingOperatorsPage
 */

import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import makeSelectAdmin, { isAdminLoading } from '../selectors';
import { compose } from 'redux';
import messages from './messages';
import { connect } from 'react-redux';
import confirm from 'reactstrap-confirm';
import { useIntl } from 'react-intl';
import {
  requestGetLibrary,
  requestGetLibraryPendingOperators,
  requestRemoveLibraryPendingOperator,
} from '../actions';
import PendingOperatorsList from '../../../components/PendingOperatorsList';
import {
  requestAcceptPermission,
  requestRejectPermission,
} from '../../LandingPage/actions';

function AdminLibraryPendingOperatorsPage(props) {
  console.log('AdminLibraryPendingOperatorsPage', props);
  const { isLoading, match, dispatch, admin } = props;

  const pending_operators = admin.pending_operators;

  const intl = useIntl();

  const lib = admin.library;

  useEffect(() => {
    if (!isLoading) {
      dispatch(requestGetLibrary(match.params.library_id));
      dispatch(requestGetLibraryPendingOperators(match.params.library_id));
    }
  }, [match.params.library_id]);

  async function acceptPendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id:
        'app.containers.AdminLibraryPendingOperatorsPage.askAcceptOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf)
    {
      dispatch(requestAcceptPermission(pendingid, 1));

      dispatch(requestGetLibraryPendingOperators(match.params.library_id));
    }
  }

  async function rejectPendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id:
        'app.containers.AdminLibraryPendingOperatorsPage.askRejectOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf)
      dispatch(requestRejectPermission(pendingid, 0));
  }

  async function removePendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id:
        'app.containers.AdminLibraryPendingOperatorsPage.askRemoveOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf) {
      dispatch(
        requestRemoveLibraryPendingOperator(
          match.params.library_id,
          pendingid,
          intl.formatMessage({ id: 'app.global.deletedMessage' }),
        ),
      );
    }
  }

  return (
    <>
      {lib && <h2>{lib.name}</h2>}
      <PendingOperatorsList
        auth={props.auth}
        loading={isLoading}
        data={pending_operators}
        deleteOpCallback={p => removePendingOperator(p)}
        acceptOpCallback={p => acceptPendingOperator(p)}
        rejectOpCallback={p => rejectPendingOperator(p)}
      />
    </>
  );
}
const mapStateToProps = createStructuredSelector({
  admin: makeSelectAdmin(),
  isLoading: isAdminLoading(),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(AdminLibraryPendingOperatorsPage);
