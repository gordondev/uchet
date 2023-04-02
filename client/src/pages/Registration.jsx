import React, {useState, useContext} from "react";
import { Button, Form, Input, Select, message } from "antd";
import { Link } from "react-router-dom";
import { LOGIN_ROUTE, MAIN_ROUTE } from "../utils/consts";
import { registration } from '../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from "../index";
import {useLocation, useNavigate} from 'react-router-dom';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Registration = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const {user} = useContext(Context);
  const [form] = Form.useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');

  const click = async () => {

    try {
      let data = await registration(email, password, division, name, surname, patronymic);
      console.log(data);
      user.setUser(data.user);
      user.setIsAuth(true);
      message.success(`Мы отправили письмо вам на почту`);
      navigate(MAIN_ROUTE);
    } catch(e) {
      message.error(e.response?.data?.message);
    }
  };

  const onFinish = (values) => {
    // console.log("Received values of form: ", values);
  };

  return (
    <section className="auth">
      <div className="container">
        <Form
          {...formItemLayout}
          form={form}
          className="formWindow"
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <h1 className="formWindowTitle">Регистрация</h1>

          <Form.Item
            name="division"
            label="Подразделение"
            hasFeedback
            onChange={e => setDivision(e.target.value)}
            rules={[
              {
                required: true,
                message: "Выберите подразделение",
              },
            ]}
          >
            <Select defaultValue={division} onChange={(value) => {setDivision(value); console.log(value);}}>
              <Option value="ТЦ-3">ТЦ-3</Option>
              <Option value="РЦ-2">РЦ-2</Option>
              <Option value="РЦ-3">РЦ-3</Option>
              <Option value="ЦЦР">ЦЦР</Option>
              <Option value="ЦОРО">ЦОРО</Option>
              <Option value="ЭЦ">ЭЦ</Option>
              <Option value="ЦТАИ">ЦТАИ</Option>
              <Option value="ЦВ">ЦВ</Option>
              <Option value="ОРБ">ОРБ</Option>
              <Option value="ХЦ">ХЦ</Option>
              <Option value="ТЦ-2">ТЦ-2</Option>
              <Option value="РТЦ-1">РТЦ-1</Option>
              <Option value="ЦОС">ЦОС</Option>
              <Option value="ОПБ">ОПБ</Option>
              <Option value="ОЯБиН">ОЯБиН</Option>
              <Option value="Управление">Управление</Option>
              <Option value="ОТИиПБ">ОТИиПБ</Option>
              <Option value="ОИиКОБ">ОИиКОБ</Option>
              <Option value="ООТ">ООТ</Option>
              <Option value="УТП">УТП</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Имя"
            onChange={e => setName(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите имя",
                whitespace: true,
              },
            ]}
          >
            <Input defaultValue={name}/>
          </Form.Item>

          <Form.Item
            name="surname"
            label="Фамилия"
            onChange={e => setSurname(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите фамилию",
                whitespace: true,
              },
            ]}
          >
            <Input defaultValue={surname}/>
          </Form.Item>

          <Form.Item
            name="patronymic"
            label="Отчество"
            onChange={e => setPatronymic(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите отчество",
                whitespace: true,
              },
            ]}
          >
            <Input defaultValue={patronymic}/>
          </Form.Item>

          <Form.Item
            name="email"
            label="Почта"
            onChange={e => setEmail(e.target.value)}
            rules={[
              {
                type: "email",
                message: "Не валидная почта",
              },
              {
                required: true,
                message: "Введите почту",
              },
            ]}
          >
            <Input defaultValue={email}/>
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            onChange={e => setPassword(e.target.value)}
            rules={[
              {
                required: true,
                message: "Введите пароль",
              },
            ]}
            hasFeedback
          >
            <Input.Password defaultValue={password}/>
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Повторите пароль"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Повторите пароль",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Два введенных вами пароля не совпадают!")
                  );
                },
              }),
            ]}
          >
            <Input.Password defaultValue={password}/>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={click}>
              Создать аккаунт
            </Button>
            <Link to={LOGIN_ROUTE} style={{ marginLeft: "20px" }}>
              Уже есть аккаунт есть? Войдите
            </Link>
            <p className="createAccount"></p>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
});

export default Registration;
