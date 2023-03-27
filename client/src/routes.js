import Login from "./pages/Login";
import Registration from "./pages/Registration";

import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  ADMIN_ROUTE,
  MAIN_ROUTE,
  VERSION_CHECKLIST_ROUTE,
  CHECKLIST_ROUTE,
} from "./utils/consts";

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
