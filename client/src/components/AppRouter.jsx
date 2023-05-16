import React, { useContext } from "react";
import { Context } from "../index";
import { Routes, Route, Navigate } from "react-router-dom";
import { userRoutes, publicRoutes, adminRoutes, lockedRoutes } from "../routes";
import { MAIN_ROUTE, LOGIN_ROUTE, ACCOUNT_LOCK_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {(user.isAuth && user.isLocked) && lockedRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      ,
      {(!user.isAuth && !user.isLocked) && publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      ,
      {(user.isAuth && !user.isLocked && user.role === "ADMIN") &&
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} exact />
      ))}
      , 
      {(user.isAuth && !user.isLocked && user.role === "USER") &&
        userRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} exact />
      ))}
      ,
      <Route
        path="*"
        element={
          (user.isAuth && user.isLocked) ? (
            <Navigate to={ACCOUNT_LOCK_ROUTE} />
          ) : user.isAuth ? (
            <Navigate to={MAIN_ROUTE} />
          ) : (
            <Navigate to={LOGIN_ROUTE} />
          )
        }
      />
    </Routes>
  );
});

export default AppRouter;
