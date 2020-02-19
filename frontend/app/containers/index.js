import App from "./App"


import HomePage from "./HomePage/Loadable"
import LanguageProvider from "./LanguageProvider"
import NotFoundPage from "./NotFoundPage/Loadable"
import Toaster from "./Toaster/Loadable"

/*
USER AUTHENTICATION
 */
import AuthProvider from "./Auth/AuthProvider/Loadable"
import ForgotPassword from "./Auth/ForgotPassword/Loadable"
import IdpPage from "./Auth/IdpPage/Loadable"
import LoginPage from "./Auth/LoginPage/Loadable"
import SignupPage from "./Auth/SignupPage/Loadable"
import ChangePassword from "./User/ChangePassword/Loadable"
import ProfilePage from "./User/ProfilePage/Loadable"
import UserPage from "./User/UserPage/Loadable"

/*
LIBRARY STUFFS
 */
import LibrarySettings from "./Library/LibrarySettings/Loadable"


export {
  App,
  Toaster,
  HomePage,
  LanguageProvider,
  NotFoundPage,

  AuthProvider,
  ForgotPassword,
  ChangePassword,
  IdpPage,
  LoginPage,
  SignupPage,
  ProfilePage,
  UserPage,

  LibrarySettings,
}

