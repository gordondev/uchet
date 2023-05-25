import React, { useContext, useState, useEffect } from "react";
import logo from "../images/logo.png";
import { observer } from "mobx-react-lite";
import { Layout, Menu, message, Dropdown, Space } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  FileDoneOutlined,
  UnorderedListOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  MAIN_ROUTE,
  PROFILE_ROUTE,
  VERSION_CHECKLIST_ROUTE,
  CHECKLIST_ROUTE,
  RESULT_ROUTE,
  ADMIN_ROUTE,
  CHART_ROUTE,
} from "../utils/consts";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../index";
import { logout } from "../http/userAPI";

const { Header } = Layout;

const NavBar = observer(() => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [currentPage, setCurrentPage] = useState("");

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

  const routes = [
    { key: "1", label: VERSION_CHECKLIST_ROUTE, path: VERSION_CHECKLIST_ROUTE },
    {
      key: "2",
      label: VERSION_CHECKLIST_ROUTE,
      path: VERSION_CHECKLIST_ROUTE + "/create",
    },
    {
      key: "3",
      label: VERSION_CHECKLIST_ROUTE,
      path: VERSION_CHECKLIST_ROUTE + "/edit/",
    },
    {
      key: "4",
      label: VERSION_CHECKLIST_ROUTE,
      path: VERSION_CHECKLIST_ROUTE + "/",
    },
    { key: "5", label: CHECKLIST_ROUTE, path: CHECKLIST_ROUTE },
    { key: "6", label: CHECKLIST_ROUTE, path: CHECKLIST_ROUTE + "/create" },
    { key: "7", label: CHECKLIST_ROUTE, path: CHECKLIST_ROUTE + "/edit/" },
    { key: "8", label: CHECKLIST_ROUTE, path: CHECKLIST_ROUTE + "/" },
    { key: "9", label: RESULT_ROUTE, path: RESULT_ROUTE },
    { key: "10", label: RESULT_ROUTE, path: RESULT_ROUTE + "/create" },
    { key: "11", label: RESULT_ROUTE, path: RESULT_ROUTE + "/edit" },
    { key: "12", label: RESULT_ROUTE, path: RESULT_ROUTE + "/" },
    { key: "13", label: ADMIN_ROUTE, path: ADMIN_ROUTE },
    { key: "14", label: PROFILE_ROUTE, path: PROFILE_ROUTE },
    { key: "15", label: CHART_ROUTE, path: CHART_ROUTE },
  ];

  useEffect(() => {
    routes.map((item) => {
      if (window.location.pathname === "/") {
        setCurrentPage(window.location.pathname);
      } else {
        if (item.path === window.location.pathname) {
          setCurrentPage(item.label);
        } else if (window.location.pathname.includes(item.path)) {
          setCurrentPage(item.label);
        }
      }
    });
  }, [window.location.pathname]);

  return (
    <Header className="header">
      <div className="logo" onClick={() => navigate(MAIN_ROUTE)}>
        <img src={logo} alt="LOGO" />
        <p>
          Учет и анализ <br /> результатов наблюдения
        </p>
      </div>

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={currentPage}
          className="navmenu"
        >
        {
          user.role === "ADMIN" &&
          <>
            <Menu.Item key={VERSION_CHECKLIST_ROUTE} icon={<FileDoneOutlined />}>
              <Link to={VERSION_CHECKLIST_ROUTE}>Версии</Link>
            </Menu.Item>
            <Menu.Item key={CHECKLIST_ROUTE} icon={<UnorderedListOutlined />}>
              <Link to={CHECKLIST_ROUTE}>Чек-листы</Link>
            </Menu.Item>
          </>
        }
          <Menu.Item key={RESULT_ROUTE} icon={<FileSearchOutlined />}>
            <Link to={RESULT_ROUTE}>Результаты</Link>
          </Menu.Item>
          <Menu.Item key={CHART_ROUTE} icon={<LineChartOutlined />}>
            <Link to={CHART_ROUTE}>Графики</Link>
          </Menu.Item>
          {
            user.role === "ADMIN" &&
            <Menu.Item key={ADMIN_ROUTE} icon={<TeamOutlined />}>
              <Link to={ADMIN_ROUTE}>Админ</Link>
            </Menu.Item>
          }
          <Menu.Item key={PROFILE_ROUTE} icon={<UserOutlined />}>
            <Dropdown
              menu={{
                items,
              }}
            >
              <Link>
                <Space icon={<UserOutlined />}>
                  {user?.user?.name}
                  <DownOutlined />
                </Space>
              </Link>
            </Dropdown>
          </Menu.Item>
        </Menu>
    </Header>
  );
});

export default NavBar;
