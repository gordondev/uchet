import React from "react";
import logo from "../images/logo.png";
import { observer } from "mobx-react-lite";
import { Layout, Menu } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { MAIN_ROUTE, PROFILE_ROUTE } from "../utils/consts";
import { useNavigate, Link } from "react-router-dom";
const { Header } = Layout;

const items = [
  {
    key: "1",
    label: <Link to={PROFILE_ROUTE}>Профиль</Link>,
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: <Link to={PROFILE_ROUTE}>Выйти</Link>,
    icon: <LogoutOutlined />,
    danger: true,
  },
];

// const navItems = [
//   <Menu.Item key="1" icon=""><Link href="/"><a>Home</a></Link></Menu.Item>
//                 <Menu.Item key="2" icon=""><Link href="/about"><a>About me</a></Link></Menu.Item>
//                 <Menu.Item key="3" icon=""><Link href="/team"><a>Team</a></Link></Menu.Item>
//                 <Menu.Item key="4" icon=""><Link href="/blog"><a>Blog</a></Link></Menu.Item>
// ];

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
        >
          <Menu.Item key="1" icon="">
            <Link to={PROFILE_ROUTE}>Результаты наблюдения</Link>
          </Menu.Item>
          <Menu.Item key="2" icon="">
            <Link to={PROFILE_ROUTE}>Версии</Link>
          </Menu.Item>
          <Menu.Item key="3" icon="">
            <Link to={PROFILE_ROUTE}>Чек-листы</Link>
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
        </Menu>
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
