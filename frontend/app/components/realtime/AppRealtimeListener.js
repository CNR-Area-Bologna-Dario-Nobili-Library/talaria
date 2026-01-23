// frontend/app/components/realtime/AppRealtimeListener.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { requestBorrowingsList, requestLendingsList, requestGetLibraryPendingOperators, requestGetLibraryOperators, requestUsersList } from '../../containers/Library/actions';
import { requestNotifications } from 'containers/App/actions';
import { requestMyLibraries, requestRequestsList } from '../../containers/Patron/actions';
import { requestPermissions } from '../../containers/Auth/AuthProvider/actions';

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

function isPatronRequestsPath(pathname) {
  return pathname.indexOf('/patron/requests') !== -1;
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
      var tOperatorsPending = null; // pending operators panel list refresh
      var tOperatorsList = null; // manage/operators panel list refresh
      var tPatronRequests = null; // patron requests list refresh
      var tPatronsList = null; // library patrons list refresh

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
      function refreshOperatorsList(libId) {
        log(TAG, 'Dispatching requestGetLibraryOperators for lib', libId);
        dispatch(requestGetLibraryOperators(libId));
      }

      function refreshPatronRequests(isArchive) {
        log(TAG, 'Dispatching requestRequestsList, archive:', isArchive);
        dispatch(requestRequestsList(null, null, { archived: isArchive ? 1 : 0 }));
      }

      function refreshPatronsList(libId) {
        log(TAG, 'Dispatching requestUsersList for lib', libId);
        dispatch(requestUsersList(libId));
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

        var targetUserId = n.target_user_id ? Number(n.target_user_id) : null;
        if (targetUserId && targetUserId !== me) {
          log(TAG, 'Notification not for current user (target:', targetUserId, ', me:', me, ') - skipping');
          return;
        }



        // Adjust these checks to match your real payload
        var notifType = (n && n.type) ? String(n.type) : '';
        var notifTypeLower = notifType.toLowerCase(); // normalize so Laravel class names with capital "Operator" match
        var notifTitle = (n && n.title) ? String(n.title).toLowerCase() : '';
        var objectType = (n && n.object && n.object.object_type) ? String(n.object.object_type).toLowerCase() : '';
        var isOperatorNotif =
          notifTypeLower.indexOf('operator') !== -1 || // e.g. "operator-request", "operator-approved", "operator-rejected"
          notifTitle.indexOf('operator') !== -1 || // Title contains "operator" (from translated notification titles)
          objectType.indexOf('temporaryability') !== -1 || // TemporaryAbility model = operator invitations
          objectType.indexOf('operator') !== -1 || // Any operator-related model
          (n && n.extra && (n.extra.temporary_ability_id || n.extra.operator_id || n.extra.abilities)) || // Has abilities = operator invitation
          (n && n.url && n.url.indexOf('/manage/operators') !== -1); // operator invitation/management URLs

        var isLibraryStatusNotif =
          (n && n.object && n.object.object_type && String(n.object.object_type).toLowerCase().indexOf('library') !== -1) ||
          (n && n.extra && n.extra.library_id != null && !n.extra.borrowing_library_id && !n.extra.lending_library_id);

        // Patron library membership notifications (Enabled, Disabled, Deleted)
        var isPatronLibraryStatusNotif =
          (n && n.title && (
            n.title.indexOf('PatronEnabledByLibrary') !== -1 ||
            n.title.indexOf('PatronDisabledByLibrary') !== -1 ||
            n.title.indexOf('PatronDeletedByLibrary') !== -1
          )) ||
          (n && n.url && n.url.indexOf('/patron/my-libraries') !== -1) ||
          (n && n.object && n.object.object_type && n.object.object_type.indexOf('LibraryUser') !== -1);

        // Patron request notifications (desk received, fulfilled, not fulfilled, etc.)
        var isPatronRequestNotif =
          (n && n.title && (
            n.title.indexOf('PatronRequest') !== -1 ||
            n.title.indexOf('PatronBorrowingRequest') !== -1
          )) ||
          (n && n.url && n.url.indexOf('/patron/requests') !== -1) ||
          (n && n.object && n.object.object_type && n.object.object_type.indexOf('PatronDocdelRequest') !== -1);

        var operatorLibId =
          (n && n.extra && n.extra.library_id != null)
            ? String(n.extra.library_id)
            : null;

        if (!operatorLibId && n && n.url) {
          // Fallback: extract /library/:id/ from URL
          operatorLibId = getLibraryIdFromPath(n.url);
        }

        // Check if this is a borrowing/lending notification (should NOT trigger permissions refresh)
        var isBorrowingLendingNotif =
          (n && n.extra && (n.extra.borrowing_library_id || n.extra.lending_library_id)) ||
          (n && n.url && (n.url.indexOf('/borrowing') !== -1 || n.url.indexOf('/lending') !== -1 || n.url.indexOf('/to-deliver') !== -1));

        // If this notification for operators actions (invite/approve/etc.) OR patron library membership changes,
        // refresh permissions and my-libraries (but NOT for borrowing/lending notifications)
        log(TAG, 'Permission refresh check:', {
          isOperatorNotif: isOperatorNotif,
          isPatronLibraryStatusNotif: isPatronLibraryStatusNotif,
          isLibraryStatusNotif: isLibraryStatusNotif,
          isBorrowingLendingNotif: isBorrowingLendingNotif,
          willRefresh: (isOperatorNotif || isPatronLibraryStatusNotif || isLibraryStatusNotif) && !isBorrowingLendingNotif,
        });

        if ((isOperatorNotif || isPatronLibraryStatusNotif || isLibraryStatusNotif) && !isBorrowingLendingNotif) {
          log(TAG, '✅ Operator/patron/library status notification received — scheduling permissions/my-libraries refresh NOW');
          clearTimeout(tOperators);
          tOperators = setTimeout(function() {
            // Refresh permissions (updates user abilities/roles)
            refreshPermissions();
            // Also refresh my libraries in case operator membership or patron status changed
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
        // Check if the notification URL targets borrowing (not lending) - prevents cross-refresh
        var notifUrl = (n && n.url) ? String(n.url) : '';
        var s1_notifTargetsBorrowing = notifUrl.indexOf('/borrowing') !== -1 || (notifUrl.indexOf('/lending') === -1 && notifUrl.indexOf('/to-deliver') === -1);

        if (s1_isBorrowingList && s1_noLending && s1_noToDeliver && s1_hasLibId && s1_correctLibrary && s1_notifTargetsBorrowing) {
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
        var s2_notifTargetsLending = notifUrl.indexOf('/lending') !== -1 || notifUrl.indexOf('/to-deliver') !== -1 || notifUrl.indexOf('/borrowing') === -1;


        if (s2_isLendingList && s2_noBorrowing && s2_hasLibId && s2_correctLibrary && s2_notifTargetsLending) {
        log(TAG, 'SCENARIO 2 MATCHED: Refreshing LENDING LIST for lib', targetCurrentLibId,);
        clearTimeout(tLender);
        tLender = setTimeout(function () {
            refreshLender(targetCurrentLibId);
          }, 300);
          return;
        }
       log(TAG, 'SCENARIO 2 SKIPPED');


        // SCENARIO 4: User on patron admin page -> refresh my libraries panel
        // Only trigger for patron-related notifications (library membership changes)
        var s4_isPatronDashboard = isPatronDashboardPath(pathname);
        var s4_isRelevantNotif = isPatronLibraryStatusNotif || isOperatorNotif || isLibraryStatusNotif;

        if (s4_isPatronDashboard && s4_isRelevantNotif) {
          log(TAG, 'SCENARIO 4 MATCHED: On patron dashboard, refresh my libraries',);
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
        var s5_isRelevantNotif = isOperatorNotif;

        log(TAG, 'SCENARIO 5 CHECK (operators pending):', {
        s5_isOperatorsPending: s5_isOperatorsPending,
        s5_hasLibId: s5_hasLibId,
        s5_correctLibrary: s5_correctLibrary,
        s5_isRelevantNotif: s5_isRelevantNotif,
        operatorLibId: operatorLibId,
        });

        if (s5_isOperatorsPending && s5_hasLibId && s5_correctLibrary && s5_isRelevantNotif) {
          log(TAG, 'SCENARIO 5 MATCHED: On operators pending page -> refreshPendingOperators()');
          clearTimeout(tOperatorsPending);
          tOperatorsPending = setTimeout(function () {
            refreshPendingOperators(targetCurrentLibId);
          }, 400);
          return;
        }
        log(TAG, 'SCENARIO 5 SKIPPED');

      
        // SCENARIO 6: User on manage/operators -> refresh operators list panel
        var s6_isOperatorsMain =
        /\/library\/\d+\/manage\/operators\/?$/.test(pathname) &&
        pathname.indexOf('/manage/operators/pending') === -1 &&
        pathname.indexOf('/manage/operators/new') === -1;

        var s6_hasLibId = !!targetCurrentLibId;
        var s6_correctLibrary = operatorLibId ? (targetCurrentLibId === operatorLibId) : true;
        var s6_isRelevantNotif = isOperatorNotif;

        log(TAG, 'SCENARIO 6 CHECK (operators main):', {
          s6_isOperatorsMain: s6_isOperatorsMain,
          s6_hasLibId: s6_hasLibId,
          s6_correctLibrary: s6_correctLibrary,
          s6_isRelevantNotif: s6_isRelevantNotif,
          operatorLibId: operatorLibId,
        });

        if (s6_isOperatorsMain && s6_hasLibId && s6_correctLibrary && s6_isRelevantNotif) {
          log(TAG, 'SCENARIO 6 MATCHED: On operators page -> refreshOperatorsList() + refreshPermissions()');
          clearTimeout(tOperatorsList);
          tOperatorsList = setTimeout(function () {
            refreshOperatorsList(targetCurrentLibId);
            refreshPermissions();
          }, 400);
          return;
        }
        log(TAG, 'SCENARIO 6 SKIPPED');

        // SCENARIO 7: User on /patron/requests page ->refresh patron requests list
        if (isPatronRequestsPath(pathname) && isPatronRequestNotif) {
          log(TAG, 'SCENARIO 7 MATCHED: On patron requests page and received patron request notification -> refreshPatronRequests()');

          clearTimeout(tPatronRequests);

          // Determine if we're on the archive page
          var isArchivePage = pathname.indexOf('/patron/requests/archive') !== -1;

          tPatronRequests = setTimeout(function () {
            log(TAG, 'SCENARIO 7: delayed refresh (patron requests list), archive:', isArchivePage);
            refreshPatronRequests(isArchivePage);
          }, 300);
          return;
        }
        log(TAG, 'SCENARIO 7 SKIPPED');

        // SCENARIO 8: User on /library/XXX/patrons page-> refresh patrons list
        // when a patron requests to join a library from /patron/my-libraries/new
        var s8_isPatronsPage = /\/library\/\d+\/patrons\/?$/.test(pathname);
        var s8_hasLibId = !!targetCurrentLibId;
        // status (join request, enabled, disabled, deleted)
        var s8_isPatronStatusNotif = isPatronLibraryStatusNotif ||
          (n && n.title && n.title.indexOf('PatronAskJoinLibrary') !== -1);

        log(TAG, 'SCENARIO 8 CHECK (patrons page):', {
          s8_isPatronsPage: s8_isPatronsPage,
          s8_hasLibId: s8_hasLibId,
          s8_isPatronStatusNotif: s8_isPatronStatusNotif,
          targetCurrentLibId: targetCurrentLibId,
        });

        if (s8_isPatronsPage && s8_hasLibId && s8_isPatronStatusNotif) {
          log(TAG, 'SCENARIO 8 MATCHED: On patrons page -> refreshPatronsList()');

          clearTimeout(tPatronsList);

          tPatronsList = setTimeout(function () {
            log(TAG, 'SCENARIO 8: delayed refresh (patrons list)');
            refreshPatronsList(targetCurrentLibId);
          }, 300);
          return;
        }
        log(TAG, 'SCENARIO 8 SKIPPED');

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
        clearTimeout(tOperatorsPending);
        clearTimeout(tOperatorsList);
        clearTimeout(tPatronRequests);
        clearTimeout(tPatronsList);

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
