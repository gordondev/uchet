import React, { useState, useContext } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { REGISTRATION_ROUTE, MAIN_ROUTE } from "../utils/consts";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import { login } from "../http/userAPI";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Login = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const data = await login(values.email, values.password);
      console.log(data);
      user.setIsAuth(true);
      user.setLocked(data.isBlocked);
      user.setUser(data);
      navigate(MAIN_ROUTE);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setIsLoading(false);
  };

  return (
    <section className="auth">
      <div className="container">
        <Form
          name="basic"
          className="formWindow"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <h1 className="formWindowTitle">Вход</h1>
          <Form.Item
            label="Почта"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите почту",
              },
            ]}
          >
            <Input
              defaultValue={email}
              prefix={<UserOutlined className="site-form-item-icon" />}
              allowClear
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите пароль",
              },
            ]}
          >
            <Input.Password
              defaultValue={password}
              prefix={<LockOutlined className="site-form-item-icon" />}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Запомнить меня</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Войти
            </Button>
            <Link to={REGISTRATION_ROUTE} style={{ marginLeft: "20px" }}>
              Создать учетную запись
            </Link>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
});
export default Login;
