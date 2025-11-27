// frontend/app/components/realtime/AppRealtimeListener.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { requestBorrowingsList, requestLendingsList, requestGetLibraryPendingOperators } from '../../containers/Library/actions';
import { requestNotifications } from 'containers/App/actions';
import { requestMyLibraries } from '../../containers/Patron/actions';
import { requestPermissions } from '../../containers/Auth/AuthProvider/actions'; // ⬅️ NEW

function getPathname() {
  return typeof window !== 'undefined' && window.location ? window.location.pathname : '';
}

function getLibraryIdFromPath(pathname) {
  var m = pathname.match(/\/library\/(\d+)/);
  return m ? String(parseInt(m[1], 10)) : null;
}

function isPatronDashboardPath(pathname) {
  return ( pathname.indexOf('/user/dashboard') !== -1 ||  pathname.indexOf('/patron/dashboard') !== -1 || pathname.indexOf('/patron/my-libraries') !== -1 );
}

function getCurrentUserIdFromProps(props) {
  var id = (props && props.auth && props.auth.user && props.auth.user.id) ||(props && props.app &&  props.app.auth && props.app.auth.user && props.app.auth.user.id) || (typeof window !== 'undefined' && window.App && window.App.user && window.App.user.id) || (typeof window !== 'undefined' && window.__APP_USER_ID) ||  0;
  id = Number(id);
  return isNaN(id) ? 0 : id;
}

function debounce(fn, wait) {
  var t = null;
  return function() {
    clearTimeout(t);
    var ctx = this;
    var args = arguments;
    t = setTimeout(function() {
      fn.apply(ctx, args);
    }, wait);
  };
}

var TAG = '[RTL]';
function log() {
  try {
    console.log.apply(console, arguments);
  } catch (e) {}
}

const AppRealtimeListener = function AppRealtimeListener(props) {
  var dispatch = props.dispatch;


  const me = getCurrentUserIdFromProps(props);

  // On login, load any notifications might have missed.
  useEffect(() => {
    if (me) {
      dispatch(requestNotifications());
    }
  }, [me, dispatch]);

  // Safely leave channels on logout or when the component unmounts
  const leaveAll = () => {
    try {
      var echo =
        typeof window !== 'undefined' && window.Echo ? window.Echo : null;
      if (!echo) return;
      try {
        echo.leave('app-notifications');
      } catch {}
    } catch {}
  };

  useEffect(
    function() {
      log(TAG, 'mount');

      var echo = typeof window !== 'undefined' ? window.Echo : null;
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

      // One timer per action type
      var tLender = null;
      var tBorrow = null;
      var tMyLib = null;
      var tOperators = null; // for operators/permissions refresh

      var debouncedBell = debounce(function() {
        log(TAG, 'Refreshing notification bell');
        dispatch(requestNotifications());
      }, 200);

      function refreshLender(libId) {
        log(TAG, 'Dispatching requestLendingsList for lib', libId);
        dispatch(requestLendingsList(libId, null, null, { _ts: Date.now() }));
      }

      function refreshBorrower(libId, isArchive) {
        log(TAG, 'Dispatching requestBorrowingsList for lib', libId, 'archive:', isArchive,);
        dispatch(
          requestBorrowingsList(libId, null, null, {
            archived: isArchive ? 1 : 0,
            _ts: Date.now(),
          }),
        );
      }

      function refreshMyLibraries() {
        log(TAG, 'Dispatching requestMyLibraries');
        dispatch(requestMyLibraries());
      }

      function refreshPermissions() {
        log(TAG, 'Dispatching requestPermissions (realtime)');
        dispatch(requestPermissions());
      }

      function refreshPendingOperators(libId) {
        log(TAG, 'Dispatching requestGetLibraryPendingOperators for lib', libId);
        dispatch(requestGetLibraryPendingOperators(libId));
      }
      
      function onAppNotification(e) {
        if (!me) return;

        log(TAG, 'Event received:', e);

        // Accept both { notification: {...} } and plain {...}
        var n = e && (e.notification || e);
        if (!n) {
          log(TAG, 'missing notification object (no notification/e payload)');
          return;
        }

        log(TAG, 'Full notification object:', JSON.stringify(n));



        // ---- Operator-related flags ----
        // Adjust these checks to match your real payload
        var notifType = (n && n.type) ? String(n.type) : '';
        var isOperatorNotif =
          notifType.indexOf('operator') !== -1 || // e.g. "operator-request", "operator-approved", "operator-rejected"
          (n && n.extra && (n.extra.temporary_ability_id || n.extra.operator_id));

        
        var operatorLibId =
          (n && n.extra && n.extra.library_id != null)
            ? String(n.extra.library_id)
            : null;

        if (!operatorLibId && n && n.url) {
          // Fallback: extract /library/:id/ from URL
          operatorLibId = getLibraryIdFromPath(n.url);
        }

        // If this notification for operators actions (invite/approve/etc.),
        // the dashboard reflects changes even if the user was on a
        if (isOperatorNotif) {
          log(TAG, 'Operator-related notification received — scheduling permissions/my-libraries refresh');
          clearTimeout(tOperators);
          tOperators = setTimeout(function() {
            // Refresh permissions (updates user abilities/roles)
            refreshPermissions();
            // Also refresh my libraries in case operator membership changed
            refreshMyLibraries();
          }, 300);
        }



        // Extract library IDs from notification.extra
        var borrowingLibId = n && n.extra && n.extra.borrowing_library_id ? String(n.extra.borrowing_library_id) : null;
        var lendingLibId = n && n.extra && n.extra.lending_library_id ? String(n.extra.lending_library_id) : null;

        // Cancel Request, refresh lending panel list
        if (!borrowingLibId && !lendingLibId && n && n.url) {
          var hintedLibId = getLibraryIdFromPath(n.url);
          if (hintedLibId) {
            var u = String(n.url);
            if (u.indexOf('/lending') !== -1 || u.indexOf('/to-deliver') !== -1) {
              lendingLibId = hintedLibId;
            } else if (u.indexOf('/borrowing') !== -1) {
              borrowingLibId = hintedLibId;
            }
            log(TAG, 'Fallback IDs from notification url:', {
              hintedLibId,
              borrowingLibId,
              lendingLibId,
            });
          }
        }
        log(TAG, 'Extracted IDs - borrowingLibId:', borrowingLibId, 'lendingLibId:', lendingLibId, );

        // Always ring bell
        debouncedBell();

        // Get current page info (TARGET user's page)
        var pathname = getPathname();
        var targetCurrentLibId = getLibraryIdFromPath(pathname);

        log(TAG, 'Current page:', { pathname: pathname, targetCurrentLibId: targetCurrentLibId,});
        log(TAG, 'Starting scenario checks...');

        // SCENARIO 1: Only refresh when on the BORROWING LIST page
        // e.g. /library/25/borrowing or /library/25/borrowing/
        var s1_isBorrowingList = /\/library\/\d+\/borrowing\/?$/.test(pathname);
        var s1_noLending      = pathname.indexOf('/lending') === -1;
        var s1_noToDeliver    = pathname.indexOf('/to-deliver') === -1;
        var s1_hasLibId       = !!targetCurrentLibId;
        var s1_correctLibrary = borrowingLibId && targetCurrentLibId === borrowingLibId;

        log(TAG, 'SCENARIO 1 CHECK:', 'isBorrowingList?', s1_isBorrowingList, '!lending?', s1_noLending, '!to-deliver?', s1_noToDeliver,  'libId?',  s1_hasLibId,'correctLib (borrowing)?', s1_correctLibrary,  );

        if (s1_isBorrowingList && s1_noLending && s1_noToDeliver && s1_hasLibId && s1_correctLibrary) {
          log(TAG, 'SCENARIO 1 MATCHED: Refreshing borrowing LIST for lib', targetCurrentLibId,);
          clearTimeout(tBorrow);
          tBorrow = setTimeout(function () {
              refreshBorrower(targetCurrentLibId, false);
            }, 300);
          return;
        }

        log(TAG, 'SCENARIO 1 SKIPPED');


        var s2_isLendingList =
        /\/library\/\d+\/lending\/?$/.test(pathname) ||
        /\/library\/\d+\/to-deliver\/?$/.test(pathname);

        var s2_noBorrowing    = pathname.indexOf('/borrowing') === -1;
        var s2_hasLibId       = !!targetCurrentLibId;
        var s2_correctLibrary = lendingLibId && targetCurrentLibId === lendingLibId;

        log(TAG,'SCENARIO 2 CHECK:', 'isLendingList?', s2_isLendingList, '!borrowing?',    s2_noBorrowing, 'libId?',         s2_hasLibId, 'correctLib (lending)?', s2_correctLibrary,);

        if (s2_isLendingList && s2_noBorrowing && s2_hasLibId && s2_correctLibrary) {
        log(TAG, 'SCENARIO 2 MATCHED: Refreshing LENDING LIST for lib', targetCurrentLibId,);
        clearTimeout(tLender);
        tLender = setTimeout(function () {
            refreshLender(targetCurrentLibId);
          }, 300);
          return;
        }
       log(TAG, 'SCENARIO 2 SKIPPED');


        // Scenario 3: https://talaria.local/library/XXX/borrowing/YYY/request -> refresh target user lending list
        log(TAG, 'SCENARIO 3 CHECK: Testing path:', pathname);
        var actorLibIdMatch = pathname.match(/\/library\/(\d+)\/borrowing\/\d+\/request/,);
        log(TAG, 'SCENARIO 3: actorLibIdMatch:', actorLibIdMatch);
        if (actorLibIdMatch) {
          var actorLibId = String(parseInt(actorLibIdMatch[1], 10));
          var s3_regexMatch = !!pathname.match(/\/library\/\d+\/borrowing\/\d+\/request(?:\/|$)/,);
          var s3_hasTargetLibId = !!targetCurrentLibId;
          var s3_differentLibs = targetCurrentLibId !== actorLibId;
          log(TAG,'SCENARIO 3: actorLibId=', actorLibId, 'targetLibId=', targetCurrentLibId, 'regexMatch?',s3_regexMatch, 'hasTargetLibId?', s3_hasTargetLibId, 'differentLibs?',  s3_differentLibs,  );
          // Only refresh if we're in a DIFFERENT library (cross-library scenario)
          if (s3_regexMatch && s3_hasTargetLibId && s3_differentLibs) {
            log( TAG, 'SCENARIO 3 MATCHED: On borrowing request in lib',  actorLibId, '-> refresh borrowing in lib', targetCurrentLibId, );
            clearTimeout(tBorrow);
            tBorrow = setTimeout(function() {
              refreshBorrower(targetCurrentLibId, false);
            }, 300);
            return;
          } else {
            log(TAG, 'SCENARIO 3 CONDITION FAILED: regexMatch=', s3_regexMatch,'hasTargetLibId=', s3_hasTargetLibId,  'differentLibs=', s3_differentLibs,);
          }
        } else {
          log(TAG, 'SCENARIO 3 NO MATCH: Not a borrowing request page');
        }
        log(TAG, 'SCENARIO 3 SKIPPED');


        // SCENARIO 4: User on patron admin page -> ONLY refresh my libraries panel
        // Scenario: https://talaria.local/patron/my-libraries -> refresh my libraries
        if (isPatronDashboardPath(pathname)) {
          log(TAG, 'SCENARIO 4 MATCHED: On patron dashboard, ONLY refresh my libraries',);
          clearTimeout(tMyLib);
          tMyLib = setTimeout(function() {
            refreshMyLibraries();
            refreshPermissions();
          }, 300);
          return;
        }
        log(TAG, 'SCENARIO 4 SKIPPED');

      // SCENARIO 5: User on manage/operators/pending -> refresh permissions (operator panel)
        var s5_isOperatorsPending =
        /\/library\/\d+\/manage\/operators\/pending\/?$/.test(pathname);

        var s5_hasLibId = !!targetCurrentLibId;
        // If backend gives operatorLibId, require it to match; otherwise accept any lib
        var s5_correctLibrary = operatorLibId ? (targetCurrentLibId === operatorLibId) : true;

        log(TAG, 'SCENARIO 5 CHECK (operators pending):', {
        s5_isOperatorsPending: s5_isOperatorsPending,
        s5_hasLibId: s5_hasLibId,
        s5_correctLibrary: s5_correctLibrary,
        operatorLibId: operatorLibId,
        });

        if (s5_isOperatorsPending && s5_hasLibId && s5_correctLibrary) {
          log(TAG, 'SCENARIO 5 MATCHED: On operators pending page -> refreshPendingOperators() + refreshPermissions() (double refresh)');
        
          clearTimeout(tOperators);
          tOperators = setTimeout(function () {
            // First refresh – gets quick updates
            refreshPendingOperators(targetCurrentLibId);
            refreshPermissions();
        
            // Second refresh – safety refresh after backend jobs settle
            setTimeout(function () {
              log(TAG, 'SCENARIO 5: second delayed refresh (pending operators + permissions)');
              refreshPendingOperators(targetCurrentLibId);
              refreshPermissions();
            }, 800); // you can tune this to 600–1200ms if needed
          }, 400); // initial delay before first refresh
        
          return;
        }
        log(TAG, 'SCENARIO 5 SKIPPED');
         // No matching scenario - do nothing
        log(TAG, 'No matching scenario, skipping refresh');
      }

      chAppNotif.listen('.app.notification', onAppNotification);

      log(TAG, 'listener attached');

      return function() {
        log(TAG, 'cleanup');
        clearTimeout(tLender);
        clearTimeout(tBorrow);
        clearTimeout(tMyLib);
        clearTimeout(tOperators); // NEW

        try {
          chAppNotif.stopListening('.app.notification', onAppNotification);
        } catch (e) {}
        leaveAll();
      };
    },
    [dispatch, me],
  );

  return null;
};

const mapStateToProps = function(state) {
  return { app: state && state.app ? state.app : {},  auth: state && state.auth ? state.auth : {}, };
};

export default connect(mapStateToProps)(AppRealtimeListener);
