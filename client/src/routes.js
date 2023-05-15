import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import VersionChecklist from "./pages/VersionChecklist";
import VersionChecklistCreate from "./pages/VersionChecklistCreate";
import VersionChecklistPage from "./pages/VersionChecklistPage";
import VersionChecklistEdit from "./pages/VersionChecklistEdit";
import Checklist from "./pages/Checklist";
import Result from "./pages/Result";
import Admin from "./pages/Admin";
import ChecklistCreate from "./pages/ChecklistCreate";
import ChecklistPage from "./pages/ChecklistPage";
import ChecklistEdit from "./pages/ChecklistEdit";
import ResultCreate from "./pages/ResultCreate";
import ResultPage from "./pages/ResultPage";
import AccountLock from "./pages/AccountLock";

import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  ADMIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  VERSION_CHECKLIST_ROUTE,
  CHECKLIST_ROUTE,
  VERSION_CHECKLIST_CREATE_ROUTE,
  VERSION_CHECKLIST_EDIT_ROUTE,
  RESULT_ROUTE,
  CHECKLIST_CREATE_ROUTE,
  CHECKLIST_EDIT_ROUTE,
  RESULT_CREATE_ROUTE,
  ACCOUNT_LOCK_ROUTE,
} from "./utils/consts";

export const adminRoutes = [
  {
    path: MAIN_ROUTE,
    Component: Main,
  },
  {
    path: PROFILE_ROUTE,
    Component: Profile,
  },
  {
    path: VERSION_CHECKLIST_ROUTE,
    Component: VersionChecklist,
  },
  {
    path: VERSION_CHECKLIST_CREATE_ROUTE,
    Component: VersionChecklistCreate,
  },
  {
    path: VERSION_CHECKLIST_ROUTE + "/:id",
    Component: VersionChecklistPage
  },
  {
    path: VERSION_CHECKLIST_EDIT_ROUTE + "/:id",
    Component: VersionChecklistEdit
  },
  {
    path: CHECKLIST_ROUTE,
    Component: Checklist
  },
  {
    path: RESULT_ROUTE,
    Component: Result
  },
  {
    path: ADMIN_ROUTE,
    Component: Admin
  },
  {
    path: CHECKLIST_CREATE_ROUTE,
    Component: ChecklistCreate
  },
  {
    path: CHECKLIST_ROUTE + "/:id",
    Component: ChecklistPage
  },
  {
    path: CHECKLIST_EDIT_ROUTE + "/:id",
    Component: ChecklistEdit
  },
  {
    path: RESULT_CREATE_ROUTE,
    Component: ResultCreate
  },
  {
    path: RESULT_ROUTE + "/:id",
    Component: ResultPage
  },
];

export const userRoutes = [
  {
    path: MAIN_ROUTE,
    Component: Main,
  },
  {
    path: PROFILE_ROUTE,
    Component: Profile,
  },
  {
    path: RESULT_ROUTE,
    Component: Result
  },
  {
    path: RESULT_CREATE_ROUTE,
    Component: ResultCreate
  },
  {
    path: RESULT_ROUTE + "/:id",
    Component: ResultPage
  },
];

export const publicRoutes = [
  {
    path: LOGIN_ROUTE,
    Component: Login,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Registration,
  },
];

export const lockedRoutes = [
  {
    path: ACCOUNT_LOCK_ROUTE,
    Component: AccountLock,
  },
];