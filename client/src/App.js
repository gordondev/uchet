import React, { useState, useContext, useEffect } from "react";

import { BrowserRouter, redirect } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { LOGIN_ROUTE, MAIN_ROUTE } from "./utils/consts";
import { Spin } from "antd";
import { ConfigProvider } from 'antd';
import localeRu from 'antd/locale/ru_RU';

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    check()
      .then((data) => {
        user.setUser(data);
        user.setIsAuth(true);
        user.setRole(data.role);
        user.setLocked(data.isBlocked);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="auth">
        <div className="container">
          <Spin size="large" />
        </div>
      </section>
    );
  }

  return (
    <ConfigProvider locale={localeRu}>
      <BrowserRouter>
        {(user._isAuth && user._isLocked) ? (
          <>
            <AppRouter />
          </>
        ) : user._isAuth ? (
          <>
            <NavBar />
            <AppRouter />
          </>
        ) : (
          <>
            <AppRouter />
          </>
        )}
      </BrowserRouter>
    </ConfigProvider>
  );
});

export default App;
