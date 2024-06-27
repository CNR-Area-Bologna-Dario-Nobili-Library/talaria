/*
 * LibraryPendingOperatorsPage
 */

import React, { useEffect, useState } from 'react';
import { createStructuredSelector } from 'reselect';
import makeSelectLibrary, { isLibraryLoading } from '../selectors';
import { compose } from 'redux';
import messages from './messages';
import { connect } from 'react-redux';
import confirm from 'reactstrap-confirm';
import { useIntl } from 'react-intl';
import {
  requestGetLibraryPendingOperators,
  requestRemoveLibraryPendingOperator,
} from '../actions';
import PendingOperatorsList from '../../../components/PendingOperatorsList';
import {
  requestAcceptPermission,
  requestRejectPermission,
} from '../../LandingPage/actions';

function LibraryPendingOperatorsPage(props) {
  console.log('LibraryPendingOperatorsPage', props);
  const { isLoading, match, dispatch, library } = props;
  const [refreshFlag, setRefreshFlag] = useState(false);

  const pending_operators = library.pending_operators;

  const intl = useIntl();

  useEffect(() => {
    if (!isLoading) {
      dispatch(requestGetLibraryPendingOperators(match.params.library_id));
    }
  }, [match.params.library_id, refreshFlag]); // Dependency array includes refreshFlag

  async function removePendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id: 'app.containers.LibraryPendingOperatorsPage.askRemoveOperatorMessage',
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
  async function acceptPendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id:
        'app.containers.LibraryPendingOperatorsPage.askAcceptOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf) {
      dispatch(requestAcceptPermission(pendingid, 1));
      setRefreshFlag(prev => !prev);
    }
  }

  async function rejectPendingOperator(pendingid) {
    let msg = intl.formatMessage({
      id:
        'app.containers.LibraryPendingOperatorsPage.askRejectOperatorMessage',
    });

    let conf = await confirm({
      title: intl.formatMessage({ id: 'app.global.confirm' }),
      message: msg,
      confirmText: intl.formatMessage({ id: 'app.global.yes' }),
      cancelText: intl.formatMessage({ id: 'app.global.no' }),
    });

    if (conf) {
      dispatch(requestRejectPermission(pendingid, 0));
      setRefreshFlag(prev => !prev);
    }
  }

  return (
    <PendingOperatorsList
      auth={props.auth}
      loading={isLoading}
      data={pending_operators}
      deleteOpCallback={p => removePendingOperator(p)}
      acceptOpCallback={p => acceptPendingOperator(p)} // Passing the function reference correctly
      rejectOpCallback={p => rejectPendingOperator(p)}
    />
  );
}
const mapStateToProps = createStructuredSelector({
  library: makeSelectLibrary(),
  isLoading: isLibraryLoading(),
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LibraryPendingOperatorsPage);
