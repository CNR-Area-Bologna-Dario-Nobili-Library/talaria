/*
 * HeaderBar Messages
 *
 * This contains all the text for the HeaderBar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.HeaderBar';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the HeaderBar component!',
  },
  UserAccount: {
    id: `${scope}.UserAccount`,
    defaultMessage: 'User Account',
  },
  Profile: {
    id: `${scope}.Profile`,
    defaultMessage: 'Profile',
  },
  EditProfile: {
    id: `${scope}.EditProfile`,
    defaultMessage: 'Edit User Profile',
  },
  Dashboard: {
    id: `${scope}.Dashboard`,
    defaultMessage: 'Dashboard',
  },
  ChangePassword: {
    id: `${scope}.ChangePassword`,
    defaultMessage: 'Change Password',
  },
  libraries: {
    id: `app.routes.Libraries`,
    // defaultMessage: 'Libraries',
  },
  institutions: {
    id: `app.routes.Institutions`,
    // defaultMessage: 'Institutions',
  },
  projects: {
    id: `app.routes.Projects`,
   // defaultMessage: 'Projects',
  },
  consortia: {
    id: `${scope}.consortia`,
    defaultMessage: 'Consortia',
  },
  admin: {
    id: `${scope}.admin`,
    defaultMessage: 'Administration',
  },
  accountant: {
    id: `${scope}.accountant`,
    defaultMessage: 'Accountant',
  },
  manager: {
    id: `${scope}.manager`,
    defaultMessage: 'Management',
  },
  patron: {
    id: `${scope}.patron`,
    defaultMessage: 'Patron',
  },
  patronDashboard: {
    id: `${scope}.PatronDashboard`,
    defaultMessage: 'My reference manager',
  },

  Logout: {
    id: `${scope}.Logout`,
    defaultMessage: 'Logout',
  },
  LoginSignup: {
    id: `${scope}.LoginSignup`,
    defaultMessage: 'Login/Signup',
  },
  AdminDashBoard: {
    id: `${scope}.AdminDashboard`,
    defaultMessage: 'Admin Dashboard',
  },
  ManagerDashBoard: {
    id: `${scope}.ManagerDashboard`,
    defaultMessage: 'Manager Dashboard',
  },
  AccountantDashBoard: {
    id: `${scope}.AccountantDashboard`,
    defaultMessage: 'Accountant Dashboard',
  },
});
