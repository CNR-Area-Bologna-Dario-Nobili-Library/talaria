/*
 * Notification Messages
 *
 * This contains all the text for the Notification component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.Notification';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Notifications',
  },

  // Tabs
  tabAll: {
    id: `${scope}.tabAll`,
    defaultMessage: 'All',
  },
  tabUnread: {
    id: `${scope}.tabUnread`,
    defaultMessage: 'Unread',
  },
  tabRead: {
    id: `${scope}.tabRead`,
    defaultMessage: 'Read',
  },

  // Empty states
  emptyUnread: {
    id: `${scope}.emptyUnread`,
    defaultMessage: 'No New Notifications',
  },
  emptyRead: {
    id: `${scope}.emptyRead`,
    defaultMessage: 'No Read Notifications',
  },
  emptyAll: {
    id: `${scope}.emptyAll`,
    defaultMessage: 'No Notifications',
  },

  // Actions (per-item)
  markAsRead: {
    id: `${scope}.markAsRead`,
    defaultMessage: 'Mark as Read',
  },
  markAsUnread: {
    id: `${scope}.markAsUnread`,
    defaultMessage: 'Mark as Unread',
  },

  // Bulk actions (optional, if you add them in the UI)
  markAllAsRead: {
    id: `${scope}.markAllAsRead`,
    defaultMessage: 'Mark all as read',
  },

  // Pagination controls
  loadMore: {
    id: `${scope}.loadMore`,
    defaultMessage: 'Load More',
  },
  showLess: {
    id: `${scope}.showLess`,
    defaultMessage: 'Show Less',
  },

  // Footer / navigation
  goToInbox: {
    id: `${scope}.goToInbox`,
    defaultMessage: 'Go to Notification Inbox',
  },

  // Misc / accessibility (optional helpers if you wire them)
  toggleDropdownAria: {
    id: `${scope}.toggleDropdownAria`,
    defaultMessage: 'Toggle notifications menu',
  },
  unreadCountAria: {
    id: `${scope}.unreadCountAria`,
    defaultMessage: '{count, plural, one {# unread notification} other {# unread notifications}}',
  },
});
