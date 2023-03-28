import React from "react";
import logo from "../images/logo.png";
import { observer } from "mobx-react-lite";
import { Layout, Menu } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const items = [
  {
    key: "1",
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Профиль
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <a target="_blank" href="#">
        Выйти
      </a>
    ),
    icon: <LogoutOutlined />,
    danger: true,
  },
];

const navItems = [
  { label: "Результаты наблюдения", link: "#" },
  { label: "Версии", link: "#" },
  { label: "Чек-листы", link: "#" },
  { label: "Графики", link: "#" },
  { label: "Статистика", link: "#" },
  { label: "Админ", link: "#" },
];

const NavBar = observer(() => {
  const navigate = useNavigate();
  return (
    <Header className="header">
      <div className="logo" onClick={() => navigate(MAIN_ROUTE)}>
        <img src={logo} alt="LOGO" />
        <p>
          Учет и анализ <br /> работы персонала
        </p>
      </div>
      <div className="mainnav">
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          className="navmenu"
          items={navItems}
        />
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Иван
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
});

export default NavBar;
