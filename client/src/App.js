import React, { useState, useContext, useEffect } from "react";

import { BrowserRouter, redirect } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { LOGIN_ROUTE, MAIN_ROUTE } from "./utils/consts";
import { Spin } from 'antd';

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        check().then(data => {
            user.setUser(data);
            user.setIsAuth(true);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
          <section className="auth">
            <div className="container">
              <Spin size="large" />
            </div>
          </section>
        )
    }

    return (
        <BrowserRouter>
    {
      user.isAuth ?
      <>
          <NavBar />
         <AppRouter />
      </>
      :
      <AppRouter />
    }
    </BrowserRouter>
    );
});

export default App;