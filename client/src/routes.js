import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import VersionChecklist from "./pages/VersionChecklist";
import VersionChecklistCreate from "./pages/VersionChecklistCreate";
import VersionChecklistPage from "./pages/VersionChecklistPage";
import VersionChecklistEdit from "./pages/VersionChecklistEdit";

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
} from "./utils/consts";

export const authRoutes = [
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
