/*
 * NotificationInbox Messages
 *
 * All text for the NotificationInbox container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.NotificationInbox';

export default defineMessages({
  // Header
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Notifications',
  },

  // Filters
  searchLabel: {
    id: `${scope}.searchLabel`,
    defaultMessage: 'Search Notifications',
  },
  searchPlaceholderDescription: {
    id: `${scope}.searchPlaceholderDescription`,
    defaultMessage: 'Description',
  },
  statusLabel: {
    id: `${scope}.statusLabel`,
    defaultMessage: 'Status',
  },
  statusAll: {
    id: `${scope}.statusAll`,
    defaultMessage: 'All',
  },
  statusNew: {
    id: `${scope}.statusNew`,
    defaultMessage: 'New (Unread)',
  },
  statusRead: {
    id: `${scope}.statusRead`,
    defaultMessage: 'Read',
  },
  startDateLabel: {
    id: `${scope}.startDateLabel`,
    defaultMessage: 'Start Date',
  },
  endDateLabel: {
    id: `${scope}.endDateLabel`,
    defaultMessage: 'End Date',
  },
  resetFilters: {
    id: `${scope}.resetFilters`,
    defaultMessage: 'Reset Filters',
  },
  markAllAsRead: {
    id: `${scope}.markAllAsRead`,
    defaultMessage: 'Mark All as Read',
  },

  // Table headers
  thIndex: {
    id: `${scope}.thIndex`,
    defaultMessage: '#',
  },
  thDate: {
    id: `${scope}.thDate`,
    defaultMessage: 'Date',
  },
  thDetail: {
    id: `${scope}.thDetail`,
    defaultMessage: 'Notification Detail',
  },
  thActions: {
    id: `${scope}.thActions`,
    defaultMessage: 'Actions',
  },

  // Empty states (table)
  emptyNew: {
    id: `${scope}.emptyNew`,
    defaultMessage: 'No New Notifications',
  },
  emptyRead: {
    id: `${scope}.emptyRead`,
    defaultMessage: 'No Read Notifications',
  },
  emptyAll: {
    id: `${scope}.emptyAll`,
    defaultMessage: 'No Notifications Found',
  },

  // Badges
  badgeNew: {
    id: `${scope}.badgeNew`,
    defaultMessage: 'New',
  },

  // Row action tooltips / titles
  viewDetailsTitle: {
    id: `${scope}.viewDetailsTitle`,
    defaultMessage: 'View Details',
  },
  markAsReadTitle: {
    id: `${scope}.markAsReadTitle`,
    defaultMessage: 'Mark as Read',
  },
  markAsUnreadTitle: {
    id: `${scope}.markAsUnreadTitle`,
    defaultMessage: 'Mark as Unread',
  },
  deleteTitle: {
    id: `${scope}.deleteTitle`,
    defaultMessage: 'Delete',
  },

  // Pagination
  previous: {
    id: `${scope}.previous`,
    defaultMessage: 'Previous',
  },
  next: {
    id: `${scope}.next`,
    defaultMessage: 'Next',
  },
  pageOf: {
    id: `${scope}.pageOf`,
    defaultMessage: 'Page {current} of {total}',
  },

  // Details modal
  detailsTitle: {
    id: `${scope}.detailsTitle`,
    defaultMessage: 'Notification Details',
  },
  descriptionLabel: {
    id: `${scope}.descriptionLabel`,
    defaultMessage: 'Description:',
  },
  dateLabel: {
    id: `${scope}.dateLabel`,
    defaultMessage: 'Date:',
  },
  visitLinkLabel: {
    id: `${scope}.visitLinkLabel`,
    defaultMessage: 'Visit Link:',
  },
  openRequestDetail: {
    id: `${scope}.openRequestDetail`,
    defaultMessage: 'Open Request Detail',
  },
  close: {
    id: `${scope}.close`,
    defaultMessage: 'Close',
  },

  // Delete confirm modal
  confirmDeleteTitle: {
    id: `${scope}.confirmDeleteTitle`,
    defaultMessage: 'Confirm Deletion',
  },
  confirmDeleteMessage: {
    id: `${scope}.confirmDeleteMessage`,
    defaultMessage: 'Are you sure you want to delete this notification?',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete',
  },

  allOnPageSelected: {
    id: `${scope}.allOnPageSelected`,
    //defaultMessage: 'All notifications {pageIds.length} on this page are selected.',
    defaultMessage: 'All notifications on this page are selected.',
  },
  selectAllPages: {
    id: `${scope}.selectAllPages`,
    //defaultMessage: 'Select all {sortedNotifications.length} notifications',
    defaultMessage: 'Select all notifications',
  },
  allPagesSelected: {
    id: `${scope}.allPagesSelected`,
    defaultMessage: 'All notifications are selected.',
  },
  clearSelection: {
    id: `${scope}.clearSelection`,
    defaultMessage: 'Clear selection',
  },
  confirmDeleteBulkMessage: {
    id: `${scope}.confirmDeleteBulkMessage`,
    defaultMessage: 'Are you sure you want to delete {count} selected notification(s)? This action cannot be undone.',
  },

  selectNotificationsMessage: {
    id: `${scope}.selectNotificationsMessage`,
    defaultMessage: 'Please select notifications to delete..',
  },

  deleteNotificationSelected : {
    id: `${scope}.deleteNotificationSelected`,
    defaultMessage: 'Delete selected',
  },
});
