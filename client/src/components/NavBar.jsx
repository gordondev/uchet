import React, { useContext } from "react";
import logo from "../images/logo.png";
import { observer } from "mobx-react-lite";
import { Layout, Menu, message, Dropdown, Space } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  MAIN_ROUTE,
  PROFILE_ROUTE,
  VERSION_CHECKLIST_ROUTE,
  CHECKLIST_ROUTE,
  RESULT_ROUTE,
  ADMIN_ROUTE,
} from "../utils/consts";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../index";
import { logout } from "../http/userAPI";

const { Header } = Layout;

const NavBar = observer(() => {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const logOut = async () => {
    try {
      await logout();
      user.setUser({});
      user.setIsAuth(false);
      localStorage.removeItem("token");
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  const items = [
    {
      key: "PROFILE_ROUTE",
      label: <Link to={PROFILE_ROUTE}>Профиль</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Link onClick={logOut}>Выйти</Link>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

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
          selectedKeys={window.location.pathname}
          className="navmenu"
        >
          <Menu.Item key={VERSION_CHECKLIST_ROUTE}>
            <Link to={VERSION_CHECKLIST_ROUTE}>Версии</Link>
          </Menu.Item>
          <Menu.Item key={CHECKLIST_ROUTE}>
            <Link to={CHECKLIST_ROUTE}>Чек-листы</Link>
          </Menu.Item>
          <Menu.Item key={RESULT_ROUTE}>
            <Link to={RESULT_ROUTE}>Результаты</Link>
          </Menu.Item>
          <Menu.Item disabled={true}>
            <Link>Графики</Link>
          </Menu.Item>
          <Menu.Item disabled={true}>
            <Link>Статистика</Link>
          </Menu.Item>
          <Menu.Item key={ADMIN_ROUTE}>
            <Link to={ADMIN_ROUTE}>Админ</Link>
          </Menu.Item>
          <Menu.Item key={PROFILE_ROUTE}>
            <Dropdown
              menu={{
                items,
              }}
            >
              <Link>
                <Space>
                  Пользователь
                  <DownOutlined />
                </Space>
              </Link>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    </Header>
  );
});

export default NavBar;
