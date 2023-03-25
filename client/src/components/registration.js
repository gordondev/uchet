import React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
} from 'antd';

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

const Registration = () => {

const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
 
  return (
    <Form

      {...formItemLayout}
      form={form}
      className="formWindow"
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: ['zhejiang', 'hangzhou', 'xihu'],
        prefix: '86',
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError

    >
    <h1 className="formWindowTitle">Регистрация</h1>

    <Form.Item
      name="select"
      label="Подразделение"
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Выберите подразделение',
        },
      ]}
    >
      <Select>
        <Option value="value1">ТЦ-3</Option>
        <Option value="value2">РЦ-2</Option>
        <Option value="value3">РЦ-3</Option>
        <Option value="value4">ЦЦР</Option>
        <Option value="value5">ЦОРО</Option>
        <Option value="value6">ЭЦ</Option>
        <Option value="value7">ЦТАИ</Option>
        <Option value="value8">ЦВ</Option>
        <Option value="value9">ОРБ</Option>
        <Option value="value10">ХЦ</Option>
        <Option value="value11">ТЦ-2</Option>
        <Option value="value12">РТЦ-1</Option>
        <Option value="value13">ЦОС</Option>
        <Option value="value14">ОПБ</Option>
        <Option value="value15">ОЯБиН</Option>
        <Option value="value16">Управление</Option>
        <Option value="value17">ОТИиПБ</Option>
        <Option value="value18">ОИиКОБ</Option>
        <Option value="value19">ООТ</Option>
        <Option value="value20">УТП</Option>
      </Select>
    </Form.Item>

    <Form.Item
        name="nickname"
        label="ФИО"
        rules={[
          {
            required: true,
            message: 'Введите ФИО',
            whitespace: true,
          },
        ]}
      >
        <Input />
    </Form.Item>
    
    <Form.Item
        name="email"
        label="Почта"
        rules={[
          {
            type: 'email',
            message: 'Не валидная почта',
          },
          {
            required: true,
            message: 'Введите почту',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          {
            required: true,
            message: 'Введите пароль',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Повторите пароль"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Повторите пароль',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Два введенных вами пароля не совпадают!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Создать аккаунт
        </Button>
        <p className="createAccount">
          Или <a href="http://localhost:3000/">Войдите</a>
        </p>
      </Form.Item>

    </Form >
  )
}

export default Registration;