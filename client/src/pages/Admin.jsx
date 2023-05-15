import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { getAllUsers } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { DeleteOutlined, LockOutlined, EditOutlined, UnlockOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';
import { updateProfile, blockUser } from "../http/userAPI";

const { Option } = Select;

const Admin = observer(() => {
  const [form] = Form.useForm();
  const [isLoadind, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [division, setDivision] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [dataIsSent, setDataIsSent] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllUsers().then((data) => setUsers(data));
    setIsLoading(false);
  }, [dataIsSent]);

  const onEditUser = (record) => {
    setDivision(record?.division);
    setName(record?.name);
    setSurname(record?.surname);
    setPatronymic(record?.patronymic);
    setEmail(record?.email);
    setPassword(record?.password);
    setRole(record?.role);
    setIsEditing(true);
    console.log(record);
    setEditingUser({...record});
  }

  const updateProfile_ = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("division", division);
    formData.append("role", role);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("patronymic", patronymic);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const userData = await updateProfile(editingUser?.id, formData);
      message.success(`Данные обновленны...`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
    setDivision("");
    setName("");
    setSurname("");
    setPatronymic("");
    setEmail("");
    setPassword("");
    setRole("");
    form.resetFields();
  }

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      width: 270,
      editable: true,
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: 'role',
      editable: true,
      filters: [
        {
          text: "USER",
          value: "USER",
        },
        {
          text: "ADMIN",
          value: "ADMIN",
        },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Подразделение",
      dataIndex: "division",
      key: 'division',
      width: 170,
      editable: true,
      filters: [
        {
          text: "ТЦ-3",
          value: "ТЦ-3",
        },
        {
          text: "РЦ-2",
          value: "РЦ-2",
        },
        {
          text: "РЦ-3",
          value: "РЦ-3",
        },
        {
          text: "ЦЦР",
          value: "ЦЦР",
        },
        {
          text: "ЦОРО",
          value: "ЦОРО",
        },
        {
          text: "ЭЦ",
          value: "ЭЦ",
        },
        {
          text: "ЦТАИ",
          value: "ЦТАИ",
        },
        {
          text: "ЦВ",
          value: "ЦВ",
        },
        {
          text: "ОРБ",
          value: "ОРБ",
        },
        {
          text: "ХЦ",
          value: "ХЦ",
        },
        {
          text: "ТЦ-2",
          value: "ТЦ-2",
        },
        {
          text: "РТЦ-1",
          value: "РТЦ-1",
        },
        {
          text: "ЦОС",
          value: "ЦОС",
        },
        {
          text: "ОПБ",
          value: "ОПБ",
        },
        {
          text: "ОЯБиН",
          value: "ОЯБиН",
        },
        {
          text: "Управление",
          value: "Управление",
        },
        {
          text: "ОТИиПБ",
          value: "ОТИиПБ",
        },
        {
          text: "ОИиКОБ",
          value: "ОИиКОБ",
        },
        {
          text: "ООТ",
          value: "ООТ",
        },
        {
          text: "УТП",
          value: "УТП",
        },
      ],
      onFilter: (value, record) => record.division === value,
    },
    {
      title: "Имя",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Фамилия",
      dataIndex: "surname",
      editable: true,
    },
    {
      title: "Отчество",
      dataIndex: "patronymic",
      editable: true,
    },
    {
      title: "Редактирование",
      editable: true,
      dataIndex: "",
      key: "x",
      render: (record) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => { onEditUser(record) }}>
          
        </Button>
      ),
    },
    {
      title: "Блокировка",
      dataIndex: "",
      key: "x",
      render: (record) => (
        record.isBlocked
        ? <Button type="primary" style={{ backgroundColor: "#52c41a" }} icon={<UnlockOutlined />} onClick={() => { setBlockStatus(record) }}>
          </Button>
        : <Button type="primary" danger icon={<LockOutlined />} onClick={() => { setBlockStatus(record) }}>
          </Button>
      ),
    },
  ];

  const setBlockStatus = async (record) => {
    console.log(!record?.isBlocked);
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("isBlocked", !record?.isBlocked);
    try {
      const userData = await blockUser(record?.id, formData);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  }

  return (
    <section className="searchSection">
      <div className="container">
        <Table
          style={{ marginTop: "20px" }}
          columns={columns}
          size="middle"
          dataSource={users}
          pagination={{
            pageSize: 30,
          }}
          scroll={{
            y: 940,
          }}
          loading={isLoadind}
        />
        <Modal
          centered
          title="Редактирование пользователя"
          cancelText="Отмена"
          visible={isEditing}
          footer={() => null}
          onCancel={() => resetEditing()}
        >
          <Form
            className="formWindow"
            name="register"
            form={form}
            style={{
              maxWidth: 470,
            }}
            scrollToFirstError
          >
            <Form.Item
              name="division"
              label="Подразделение"
              hasFeedback
            >
              <Select
                placeholder={editingUser?.division}
                allowClear
                onChange={(value) => {
                  setDivision(value);
                }}
              >
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
              name="role"
              label="Роль"
              hasFeedback
            >
              <Select
                placeholder={editingUser?.role}
                allowClear
                onChange={(value) => {
                  setRole(value);
                }}
              >
                <Option value="USER">USER</Option>
                <Option value="ADMIN">ADMIN</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Имя"
              onChange={debounce((e) => setName(e.target.value), 500)}
            >
              <Input placeholder={editingUser?.name} allowClear />
            </Form.Item>

            <Form.Item
              name="surname"
              label="Фамилия"
              onChange={debounce((e) => setSurname(e.target.value), 500)}
            >
              <Input placeholder={editingUser?.surname} allowClear />
            </Form.Item>

            <Form.Item
              name="patronymic"
              label="Отчество"
              onChange={debounce((e) => setPatronymic(e.target.value), 500)}
            >
              <Input placeholder={editingUser?.patronymic} allowClear />
            </Form.Item>

            <Form.Item
              name="email"
              label="Почта"
              onChange={debounce((e) => setEmail(e.target.value), 500)}
              rules={[
                {
                  type: "email",
                  message: "Не валидная почта",
                },
              ]}
            >
              <Input placeholder={editingUser?.email} allowClear />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              onChange={debounce((e) => setPassword(e.target.value), 500)}
              hasFeedback
            >
              <Input.Password allowClear placeholder="Придумайте пароль"/>
            </Form.Item>
            <Button
              loading={dataIsSent}
              style={{ marginTop: "20px"}}
              type="primary"
              htmlType="submit"
              onClick={updateProfile_}
            >
              Сохранить
            </Button>
          </Form>
        </Modal>
      </div>
    </section>
  );
});

export default Admin;
