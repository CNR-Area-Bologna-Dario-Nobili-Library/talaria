// frontend/app/components/realtime/AppRealtimeListener.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  requestBorrowingsList,
  requestLendingsList,
  requestUsersList,
} from '../../containers/Library/actions';
import { requestNotifications } from 'containers/App/actions';
import { requestMyLibraries } from '../../containers/Patron/actions';

function getPathname() {
  return (typeof window !== 'undefined' && window.location) ? window.location.pathname : '';
}

function getLibraryIdFromPath(pathname) {
  var m = pathname.match(/\/library\/(\d+)/);
  return m ? String(parseInt(m[1], 10)) : null;
}

function isPatronAdminPath(pathname) {
  var segments = ['users', 'patrons', 'members', 'registrations', 'requests', 'approvals', 'pending'];
  for (var i = 0; i < segments.length; i++) {
    if (pathname.indexOf('/' + segments[i]) !== -1) return true;
  }
  return false;
}

function isPatronDashboardPath(pathname) {
  return pathname.indexOf('/user/dashboard') !== -1 || 
         pathname.indexOf('/patron/dashboard') !== -1 ||
         pathname.indexOf('/patron/my-libraries') !== -1;
}

function getCurrentUserIdFromProps(props) {
  var id =
    (props && props.auth && props.auth.user && props.auth.user.id) ||
    (props && props.app  && props.app.auth  && props.app.auth.user && props.app.auth.user.id) ||
    (typeof window !== 'undefined' && window.App && window.App.user && window.App.user.id) ||
    (typeof window !== 'undefined' && window.__APP_USER_ID) ||
    0;
  id = Number(id);
  return isNaN(id) ? 0 : id;
}

function pickNum(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (obj && obj[k] != null) {
      var n = Number(obj[k]);
      if (!isNaN(n)) return n;
    }
  }
  return null;
}

function debounce(fn, wait) {
  var t = null;
  return function () {
    clearTimeout(t);
    var ctx = this; var args = arguments;
    t = setTimeout(function () { fn.apply(ctx, args); }, wait);
  };
}

var TAG = '[RTL]';
function log() { try { console.log.apply(console, arguments); } catch (e) {} }

const AppRealtimeListener = function AppRealtimeListener(props) {
  var dispatch = props.dispatch;

  const me = getCurrentUserIdFromProps(props);


  // Pull missed notifications right after login (or initial load if already logged in)
  useEffect(() => {
  if (me) {
      dispatch(requestNotifications());
    }
  }, [me, dispatch]);
  
  // ADDED: helper to safely leave channels (logout/unmount)
  const leaveAll = () => {
    try {
      var echo = (typeof window !== 'undefined' && window.Echo) ? window.Echo : null;
      if (!echo) return;
      try { echo.leave('app-notifications'); } catch {}
    } catch {}
  };

  useEffect(function () {
    log(TAG, 'mount');

    var echo = (typeof window !== 'undefined') ? window.Echo : null;
    if (!echo || typeof echo.channel !== 'function') {
      log(TAG, 'Echo not ready, bail');
      return;
    }

    if (!me) {
      log(TAG, 'No user -> unsubscribing & skipping listener attach');
      leaveAll();
      return;
    }

    var chAppNotif = echo.channel('app-notifications');

    // Only one timer per action type
    var tLender = null;
    var tBorrow = null;
    var tUsers  = null;
    var tMyLib  = null;

    var debouncedBell = debounce(function () {
      log(TAG, '🔔 Refreshing notification bell');
      dispatch(requestNotifications());
    }, 200);

    function refreshLender(libId) {
      log(TAG, '📤 Dispatching requestLendingsList for lib', libId);
      dispatch(requestLendingsList(libId, null, null, { _ts: Date.now() }));
    }
    
    function refreshBorrower(libId, isArchive) {
      log(TAG, '📥 Dispatching requestBorrowingsList for lib', libId, 'archive:', isArchive);
      dispatch(requestBorrowingsList(libId, null, null, { archived: isArchive ? 1 : 0, _ts: Date.now() }));
    }
    
    function refreshUsers(libId) {
      log(TAG, '👥 Dispatching requestUsersList for lib', libId);
      dispatch(requestUsersList(libId, null, null, { _ts: Date.now() }));
    }
    
    function refreshMyLibraries() {
      log(TAG, '📚 Dispatching requestMyLibraries');
      dispatch(requestMyLibraries());
    }

    function onAppNotification(e) {
      if (!me) return;

      log(TAG, '📡 Event received:', e);
      
      if (!e || !e.notification) {
        log(TAG, '⚠️ missing notification object');
        return;
      }

      var n = e.notification;
      var actorId = pickNum(n, ['notifier_id']);
      var targetId = pickNum(n, ['target_user_id']);

      log(TAG, '📦 Notification:', { me: me, actorId: actorId, targetId: targetId });

      // 1) Always ring bell
      debouncedBell();

      // 2) Get current page info
      var pathname = getPathname();
      var libId = getLibraryIdFromPath(pathname);

      log(TAG, '📍 Current page:', { pathname: pathname, libId: libId });

      // 3) Dispatch based on URL - ONE refresh per type
      
      // If on borrowing page -> refresh borrowing list
      if (pathname.indexOf('/borrowing') !== -1 && libId) {
        var isArchive = pathname.indexOf('/archive') !== -1;
        log(TAG, '✅ On borrowing page, refreshing list');
        clearTimeout(tBorrow);
        tBorrow = setTimeout(function () { refreshBorrower(libId, isArchive); }, 300);
      }

      // If on lending page -> refresh lending list
      if ((pathname.indexOf('/lending') !== -1 || pathname.indexOf('/to-deliver') !== -1) && libId) {
        log(TAG, '✅ On lending page, refreshing list');
        clearTimeout(tLender);
        tLender = setTimeout(function () { refreshLender(libId); }, 300);
      }

      // If on patron admin page -> refresh users list
      if (isPatronAdminPath(pathname) && libId) {
        log(TAG, '✅ On patron admin page, refreshing users list');
        clearTimeout(tUsers);
        tUsers = setTimeout(function () { refreshUsers(libId); }, 300);
      }

      // If on patron dashboard -> refresh my libraries
      if (isPatronDashboardPath(pathname)) {
        log(TAG, '✅ On patron dashboard, refreshing my libraries');
        clearTimeout(tMyLib);
        tMyLib = setTimeout(function () { refreshMyLibraries(); }, 300);
      }


      // If target is me (and actor is not me) -> also refresh my libraries (for side panel)
      if (me && targetId === me && actorId !== me && !isPatronDashboardPath(pathname)) {
        log(TAG, '✅ Target is me, refreshing my libraries panel');
        clearTimeout(tMyLib);
        tMyLib = setTimeout(function () { refreshMyLibraries(); }, 300);
      }

      // Custom DOM event
      try { 
        window.dispatchEvent(new CustomEvent('dd:notification', { detail: { notification: n } })); 
      } catch (err) {}
    }

    chAppNotif.listen('.app.notification', onAppNotification);

    log(TAG, '✅ listener attached');

    return function () {
      log(TAG, 'cleanup');
      clearTimeout(tLender);
      clearTimeout(tBorrow);
      clearTimeout(tUsers);
      clearTimeout(tMyLib);

      try { chAppNotif.stopListening('.app.notification', onAppNotification); } catch (e) {}
      leaveAll();
    };
  
  }, [dispatch, me]);

  return null;
};

const mapStateToProps = function (state) {
  return {
    app:  state && state.app  ? state.app  : {},
    auth: state && state.auth ? state.auth : {},
  };
};

export default connect(mapStateToProps)(AppRealtimeListener);
