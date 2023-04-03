import React, { useContext } from "react";
import logo from "../images/logo.png";
import { observer } from "mobx-react-lite";
import { Layout, Menu, message, Dropdown, Space } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  MAIN_ROUTE,
  PROFILE_ROUTE,
  VERSION_CHECKLIST_ROUTE,
} from "../utils/consts";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../index";
import { logout } from '../http/userAPI';
const { Header } = Layout;

const NavBar = observer(() => {
  const navigate = useNavigate();
  const {user} = useContext(Context);

  const logOut = async () => {
    try {
      const response = await logout();
      user.setUser({});
      user.setIsAuth(false);
      localStorage.removeItem('token');
    } catch(e) {
      message.error(e.response?.data?.message);
    }
  };

  const items = [
  {
    key: "1",
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
          defaultSelectedKeys={["1"]}
          className="navmenu"
        >
          <Menu.Item key="1" icon="">
            <Link to={VERSION_CHECKLIST_ROUTE}>Версии</Link>
          </Menu.Item>
          <Menu.Item key="2" icon="">
            <Link to={PROFILE_ROUTE}>Чек-листы</Link>
          </Menu.Item>
          <Menu.Item key="3" icon="">
            <Link to={PROFILE_ROUTE}>Результаты</Link>
          </Menu.Item>
          <Menu.Item key="4" icon="">
            <Link to={PROFILE_ROUTE}>Графики</Link>
          </Menu.Item>
          <Menu.Item key="5" icon="">
            <Link to={PROFILE_ROUTE}>Статистика</Link>
          </Menu.Item>
          <Menu.Item key="6" icon="">
            <Link to={PROFILE_ROUTE}>Админ</Link>
          </Menu.Item>
          <Menu.Item>
            <Dropdown
                menu={{
                  items,
                }}
              >
            <Link onClick={(e) => e.preventDefault()}>
              <Space>
                {user?.user?.name}
                <DownOutlined />
              </Space>
            </Link>
          </Dropdown>
          </Menu.Item>
        </Menu>
        {/*<Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {user?.user?.name}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>*/}
      </div>
    </Header>
  );
});

export default NavBar;
