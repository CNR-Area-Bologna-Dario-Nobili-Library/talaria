import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import makeSelectApp from 'containers/App/selectors';
import { loadNotifications } from 'containers/App/actions';
import { TOAST_AUTOCLOSE_DURATION } from 'utils/constants';
import 'react-toastify/dist/ReactToastify.css';

// Storage key for tracking displayed notifications in session
const SEEN_STORAGE_KEY = 'notif_seen_v1';
// Cooldown period to prevent duplicate toasts
const REALTIME_LIST_COOLDOWN_MS = 1500;

/**Get current page pathname*/
function getCurrentPathname() {
  return typeof window !== 'undefined' && window.location ? window.location.pathname : '';
}

/** Avoid double notification blue/green */
function isOnLendingPage() {
  var pathname = getCurrentPathname();
  return pathname.indexOf('/lending') !== -1 ||
         pathname.indexOf('/to-deliver') !== -1;
}

/**
 * Load previously seen notification IDs from session storage
 * @returns {Object} Map of seen notification IDs
  If the page refreshes or the component re-renders, without tracking, the same notification would show again
  Session storage persists during the browser tab session but clears when tab closes
  Prevents annoying duplicate toasts for notifications already seen in this session
 */
function loadSeen() {
  try {
    if (typeof window === 'undefined') return {};
    var raw = window.sessionStorage.getItem(SEEN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

/**
 * Save seen notification IDs to session storage
 * @param {Object} map - Map of seen notification IDs
 */
function saveSeen(map) {
  try {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {}
}

/**
 * Generate unique key for notifications from the Redux store list
 * @param {Object} n - Notification object from store
 * @returns {string} Unique identifier for the notification
 * Notifications in the Redux store may not have a **unique id** so need consistent way to track "have we shown this notification?"
 */
function normalizeListKey(n) {
  var message = (n && n.data && (n.data.title || n.data.message)) || 'Notification';
  var url = n && n.data ? n.data.url : '';
  return n && n.id ? String(n.id) : ('list|' + String(message) + '|' + String(url || ''));
}

/**
 * Generate unique key for realtime notification events
 * @param {Object} e - Event data from Echo channel
 * @returns {string} Unique identifier for the event
 * Prefix "evt|" indicates it came from Echo channel
 */
function normalizeEvtKey(e) {
  var title = (e && e.item) ? String(e.item) : 'Notification';
  var tgt = (e && e.target_user_id != null) ? String(e.target_user_id) : 'na';
  var req = (e && e.request_id != null) ? String(e.request_id) : 'na';
  var url = (e && e.url) ? String(e.url) : '';
  var ts = (e && e.timestamp) ? String(e.timestamp) : (e && e.created_at) ? String(e.created_at) : '';
  return 'evt|' + req + '|' + tgt + '|' + title + '|' + url + '|' + ts;
}

/**
 * Display a toast notification only once (prevents duplicates)
 * @param {string} toastId - Unique identifier for the toast
 * @param {string} title - Notification title/message
 * @param {string} url - Optional URL to navigate to on click
 * @param {Object} seenRef - React ref containing seen notification IDs
 * @param {Function} dispatch - Redux dispatch function for navigation
 * @returns {boolean} True if toast was shown, false if already seen
 */
function showToastOnce(toastId, title, url, seenRef, dispatch) {
  if (toastSuppressed()) return false;
  if (!toastId) toastId = 'msg|' + String(title) + '|' + String(url || '');
  if (seenRef.current[toastId]) return false;
  if (toast.isActive && toast.isActive(toastId)) return false;

  toast.info('🔔 ' + (title || 'Notification'), {
    toastId: toastId,
    autoClose: TOAST_AUTOCLOSE_DURATION,
    onClick: function () {
      if (url) {
        /**
 * Converts absolute URLs from the backend into relative paths to prevent React Router from incorrectly appending the full URL to the current path.
 * <Link> component navigates correctly in this case
 */
        var relativePath = url;
        try {
          if (url.indexOf('http') === 0 || url.indexOf('://') !== -1) {
            var urlObj = new URL(url);
            relativePath = urlObj.pathname + urlObj.search + urlObj.hash;
          }
        } catch (e) {
          // If URL parsing fails, use original URL as fallback
        }

        // Use React Router navigation (no page reload)
        // Fallback to window.location if dispatch not available
        if (dispatch) {
          dispatch(push(relativePath));
        } else {
          window.location.assign(url);
        }
      }
    },
  });
  seenRef.current[toastId] = true;
  saveSeen(seenRef.current);
  return true;
}

/**
 * Resolve current user ID from various possible sources
 * @param {Object} props - Component props
 * @returns {number} User ID or 0 if not found
 */
function resolveUserId(props) {
  try {
    var candidates = [
      function () { return props && props.app && props.app.auth && props.app.auth.user && props.app.auth.user.id; },
      function () { return props && props.auth && props.auth.user && props.auth.user.id; },
      function () { return props && props.user && props.user.id; },
      function () { return (typeof window !== 'undefined' && window.App && window.App.user && window.App.user.id); },
      function () { return (typeof window !== 'undefined' && window.__APP_USER_ID); },
    ];
    for (var i = 0; i < candidates.length; i++) {
      var v = Number(candidates[i]() || 0);
      if (v) return v;
    }
  } catch (e) {}
  return 0;
}

function toastSuppressed() {
  if (typeof window === 'undefined') return false;
  const until = window.__SUPPRESS_NOTIF_TOAST_UNTIL || 0;
  return Date.now() < until;
}

/**
 * AppNotificationListener Component
 * 
 * Handles displaying toast notifications for the application.
 * This component is responsible ONLY for showing visual notifications (toasts).
 * Data refreshing is handled by AppRealtimeListener.
 * 
 * Features:
 * - Listens to 'app-notifications' channel via Laravel Echo
 * - Displays toast notifications for targeted users
 * - Prevents duplicate toasts using session storage
 * - Shows latest unread notification from Redux store
 * - Implements cooldown to avoid conflicts with realtime updates
 */
const AppNotificationListener = (props) => {
  const seenRef = useRef({});
  const lastRealtimeMsRef = useRef(0);
  const lastUnreadCount = useRef(0);

  useEffect(function () {
    seenRef.current = loadSeen();
  }, []);

  // ========== Realtime listener - ONLY FOR TOASTS ==========
  useEffect(() => {
    var currentUserId = resolveUserId(props);
    if (!currentUserId) return;

    var echoReady =
      (typeof window !== 'undefined') &&
      window.Echo &&
      typeof window.Echo.channel === 'function';
    if (!echoReady) return;

    if (typeof window !== 'undefined' && window.__APP_NOTIF_ACTIVE) return;

    const channelName = 'app-notifications';
    const channel = window.Echo.channel(channelName);

    function onEvent(e) {
      if (!e) return;

      const eventData = e.notification || e;

      var targetUserId =
        eventData.target_user_id != null ? Number(eventData.target_user_id) : null;
      var notifierId =
        eventData.notifier_id != null ? Number(eventData.notifier_id) : null;

      // Only react to events explicitly targeted to the current user
      if (targetUserId == null || targetUserId !== currentUserId) return;

      // Skip borrowing/lending notifications if user is currently on that page
      var url = eventData.url || '';
      var isBorrowingLendingNotif =
        url.indexOf('/lending') !== -1 ||
        url.indexOf('/to-deliver') !== -1 ||
        url.indexOf('/borrowing') !== -1;

      // Note: We only suppress if the current user is the notifier (to avoid double toasts for own actions)
      // We DO NOT suppress just because user is on lending page - they need to see requests from others
      if (isBorrowingLendingNotif && (notifierId === currentUserId)) {

       // Mark as seen so store list watcher won't show it either
        var filterKey = normalizeEvtKey(eventData);
        seenRef.current[filterKey] = true;
        saveSeen(seenRef.current);
        lastRealtimeMsRef.current = Date.now();
        return;
      }

      if (toastSuppressed()) return;

      var title = (eventData.item && String(eventData.item).trim()) || 'Notification';
      var key = normalizeEvtKey(eventData);

      var isRead =
        eventData.read === true ||
        eventData.read === 1 ||
        !!eventData.read_at ||
        !!eventData.readed;
      if (!isRead) {
        showToastOnce(key, title, url, seenRef, props.dispatch);
      }
      lastRealtimeMsRef.current = Date.now();
    }

    //NOTE: the "dot" before event name is required
    channel.listen('.app.notification', onEvent);
    if (typeof window !== 'undefined') window.__APP_NOTIF_ACTIVE = true;

    return () => {
      try { channel.stopListening('.app.notification', onEvent); } catch (err) {}
      try {
        if (window.Echo.leaveChannel) window.Echo.leaveChannel(channelName);
        else window.Echo.leave(channelName);
      } catch (err) {}
      if (typeof window !== 'undefined') window.__APP_NOTIF_ACTIVE = false;
    };
  }, [
    props.app && props.app.auth && props.app.auth.user && props.app.auth.user.id
  ]);

  // ========== Toast latest unread from store list ==========
  useEffect(() => {
    var app = props.app || {};
    var list =
      app.notifications && Array.isArray(app.notifications.data)
        ? app.notifications.data
        : [];
    if (!list.length) {
      lastUnreadCount.current = 0;
      return;
    }

    // Detect if bell count increased (new unread landed)
    var unreadTotal =
      app.notifications && app.notifications.unreaded_total != null
        ? Number(app.notifications.unreaded_total) || 0
        : list.filter(function(n) { return n && (n.read_at == null || n.read === false); }).length;

    // If we just handled a realtime event, skip to avoid duplicate toast
    if (Date.now() - lastRealtimeMsRef.current < REALTIME_LIST_COOLDOWN_MS) {
      lastUnreadCount.current = unreadTotal;
      return;
    }

    if (toastSuppressed()) {
      lastUnreadCount.current = unreadTotal;
      return;
    }

    var latest = null;
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (!n) continue;
      var unread = (n.read_at == null) || (n.read === false);
      if (!unread) continue;

      if (!latest) { latest = n; continue; }
      var a = Date.parse((n.updated_at || n.created_at || '')) || 0;
      var b = Date.parse((latest.updated_at || latest.created_at || '')) || 0;
      if (a > b) latest = n;
    }
    if (!latest) return;

    var idKey = normalizeListKey(latest);
    var message =
      (latest.data && (latest.data.title || latest.data.message)) ||
      'Notification';
    var url = latest.data && latest.data.url;

    // Skip notifications since the user is performing actions and already sees green success toasts)
    var isBorrowingLendingUrl = url && (
      url.indexOf('/lending') !== -1 ||
      url.indexOf('/to-deliver') !== -1 ||
      url.indexOf('/borrowing') !== -1
    );

    var notifierId = latest.data && latest.data.notifier_id != null ? Number(latest.data.notifier_id) : null;
    var currentUserId = resolveUserId(props);

    if (isBorrowingLendingUrl && (notifierId === currentUserId || Date.now() - lastRealtimeMsRef.current < REALTIME_LIST_COOLDOWN_MS)) {
      lastUnreadCount.current = unreadTotal;
      return;
    }

    showToastOnce(idKey, message, url, seenRef, props.dispatch);

    // Remember last unread count after attempting toast
    lastUnreadCount.current = unreadTotal;
  }, [
    props.app && props.app.notifications && props.app.notifications.data
  ]);

  // ToastContainer is rendered once via components/Toaster in app.js
  return null;
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(AppNotificationListener);
