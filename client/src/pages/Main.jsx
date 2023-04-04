import React, { useState, useContext, useEffect } from "react";
import girl from "../images/welcome.png";
import { Button, Typography, Skeleton } from "antd";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { check } from "../http/userAPI";
import { VERSION_CHECKLIST_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Main = observer(() => {
  const {user} = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
        check().then(data => {
            user.setUser(data);
        }).finally(() => setLoading(false));
    }, []);

  return (
    <section className="mainSection">
      <div className="container">
        {
            loading ?
              <div className="blockWelcome">
              <Skeleton.Image active style={{ width: "220px", height: "220px" }}/>
                <div className="blockWelcome__information">
                  <Skeleton.Input active size="default" style={{ marginBottom: "20px", width: "500px"}}/>
                  <Skeleton.Input active size="small" style={{ marginBottom: "20px", width: "500px"}}/>
                  <Skeleton.Input active size="small" style={{ marginBottom: "20px", width: "500px"}}/>
                  <Skeleton.Input active size="small" style={{ marginBottom: "20px", width: "500px"}}/>
                  <Skeleton.Input active size="small" style={{ width: "300px"}}/>
                </div>
              </div>
            :
            <div className="blockWelcome">
              <img src={girl} alt="girl" />
              <div className="blockWelcome__information">
                <Title
                  className="blockWelcome__title"
                  style={{ color: "#0e78ff", marginBottom: "0px" }}
                >
                  Добро пожаловать, {user?.user?.name}!
                </Title>
                <Title level={5} style={{ marginBottom: "20px" }}>
                  Заполняйте результаты наблюдений и их события. <br />Просматривайте
                  статистики итоговых значений по результатам наблюдений. <br />Формируйте
                  графики и выводите результаты на печать.
                </Title>
                <Button type="primary" htmlType="submit" onClick={() => navigate(VERSION_CHECKLIST_ROUTE)}>
                  Начать
                </Button>
              </div>
        </div>
        }
      </div>
    </section>
  );
});

export default Main;
