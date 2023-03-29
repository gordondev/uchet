import React from "react";
import girl from "../images/welcome.png";
import { Button } from "antd";
import { Typography } from "antd";

const { Title } = Typography;
const Main = () => {
  return (
    <section className="mainSection">
      <div className="container">
        <div className="blockWelcome">
          <img src={girl} alt="girl" />
          <div className="blockWelcome__information">
            <Title className="blockWelcome__title" style={{ color: "#0e78ff" }}>
              Добро пожаловать, Иван!
            </Title>
            <Title level={5} style={{ marginBottom: "20px" }}>
              Заполняйте результаты наблюдений и их события. Просматривайте
              статистики итоговых значений по результатам наблюдений. Формируйте
              графики и выводите результаты на печать.
            </Title>
            <Button type="primary" htmlType="submit">
              Приступить
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
