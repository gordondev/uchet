import React, {useContext} from "react";
import {Context} from "../index";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes, authRoutes } from "../routes";
import { MAIN_ROUTE, LOGIN_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const {user} = useContext(Context);

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      ,
      {user.isAuth && authRoutes.map(({ path, Component }) => 
        <Route key={path} path={path} element={<Component/>} exact/>
       )},
      <Route path="*" element={user.isAuth? <Navigate to={MAIN_ROUTE} /> : <Navigate to={LOGIN_ROUTE} />} />
    </Routes>
  );
});

export default AppRouter;
