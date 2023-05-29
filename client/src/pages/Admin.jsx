import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { getAllUsers, updateProfile, blockUser, createUser } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { DeleteOutlined, LockOutlined, EditOutlined, UnlockOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';

const { Option } = Select;

const divisions = [
  "ТЦ-3",
  "РЦ-2",
  "РЦ-3",
  "ЦЦР",
  "ЦОРО",
  "ЭЦ",
  "ЦТАИ",
  "ЦВ",
  "ОРБ",
  "ХЦ",
  "ТЦ-2",
  "РТЦ-1",
  "ЦОС",
  "ОПБ",
  "ОЯБиН",
  "Управление",
  "ОТИиПБ",
  "ОИиКОБ",
  "ООТ",
  "УТП",
];

const Admin = observer(() => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formDataIsSent, setFormDataIsSent] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
      message.error("Ошибка при загрузке пользователей.");
    } finally {
      setIsLoading(false);
    }
  };

  const onEditUser = (record) => {
    setEditingUser(record);
    setIsEditing(true);
    form.resetFields();
    form.setFieldsValue({
      division: record.division,
      role: record.role,
      name: record.name,
      surname: record.surname,
      patronymic: record.patronymic,
      email: record.email,
    });
  };

  const updateProfile_ = async () => {
    setFormDataIsSent(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append("division", values.division);
      formData.append("role", values.role);
      formData.append("name", values.name);
      formData.append("surname", values.surname);
      formData.append("patronymic", values.patronymic);
      formData.append("email", values.email);

      if (values.password) {
        formData.append("password", values.password);
      }

      await updateProfile(editingUser.id, formData);
      message.success("Данные обновлены.");
      resetEditing();
      loadData();
    } catch (error) {
      console.log(error);
      message.error(error.message || "Ошибка при обновлении данных.");
    } finally {
      setFormDataIsSent(false);
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingUser(null);
    form.resetFields();
  };

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
        { text: "USER", value: "USER" },
        { text: "ADMIN", value: "ADMIN" },
      ],

      onFilter: (value, record) => record.role === value,
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: 120 }}
          onChange={(value) => handleRoleChange(record, value)}
          disabled={isEditing && editingUser && editingUser.id !== record.id}
        >
          <Option value="USER">USER</Option>
          <Option value="ADMIN">ADMIN</Option>
        </Select>
      ),
    },
    {
      title: "Имя",
      dataIndex: "name",
      key: 'name',
      editable: true,
    },
    {
      title: "Фамилия",
      dataIndex: "surname",
      key: 'surname',
      editable: true,
    },
    {
      title: "Отчество",
      dataIndex: "patronymic",
      key: 'patronymic',
      editable: true,
    },
    {
      title: "Подразделение",
      dataIndex: "division",
      key: "division",
      editable: true,
      filters: divisions.map((division) => ({
        text: division,
        value: division,
      })),
      onFilter: (value, record) => record.division === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Действия",
      key: "action",
      render: (text, record) => (
        <span>
          {isEditing && editingUser && editingUser.id === record.id ? (
            <span>
              <Button
                type="primary"
                onClick={updateProfile_}
                loading={formDataIsSent}
              >
                Сохранить
              </Button>
              <Button onClick={resetEditing}>Отмена</Button>
            </span>
          ) : (
            <span>
              {record.isBlocked ? (
                <Button
                  type="primary"
                  onClick={() => setBlockStatus(record)}
                  loading={formDataIsSent}
                  icon={<UnlockOutlined />}
                >
                  
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => setBlockStatus(record)}
                  loading={formDataIsSent}
                  icon={<LockOutlined />}
                >
                  
                </Button>
              )}
              <Button
                type="primary"
                onClick={() => onEditUser(record)}
                disabled={isEditing}
                icon={<EditOutlined />}
                style={{ marginLeft: 8 }}
              >
                
              </Button>
            </span>
          )}
        </span>
      ),
    },
  ];

  const handleRoleChange = debounce(async (record, value) => {
    try {
      await updateRole(record.id, value);
      message.success("Роль обновлена.");
    } catch (error) {
      console.log(error);
      message.error("Ошибка при обновлении роли.");
    }
  }, 500);

  const updateRole = async (id, role) => {
    try {
      const formData = new FormData();
      formData.append("role", role);
      await updateProfile(id, formData);
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const setBlockStatus = async (user) => {
    try {
      const formData = new FormData();
      formData.append("isBlocked", !user.isBlocked);
      await blockUser(user.id, formData);
      message.success(
        user.isBlocked ? "Пользователь разблокирован." : "Пользователь заблокирован."
      );
      loadData();
    } catch (error) {
      console.log(error);
      message.error("Ошибка при изменении статуса блокировки пользователя.");
    }
  };

  return (
    <>
    <div className="container">
      <Table
        style={{ marginTop: "20px" }}
        dataSource={users}
        columns={columns}
        loading={isLoading}
        rowKey={(record) => record.id}
        bordered
        size="small"
        scroll={{ x: 1000 }}
      />
      <Modal
        title="Редактирование пользователя"
        visible={isEditing}
        onCancel={resetEditing}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Пожалуйста, введите email" },
              { type: "email", message: "Некорректный email" },
            ]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Роль"
            name="role"
            rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
          >
            <Select>
              <Option value="USER">USER</Option>
              <Option value="ADMIN">ADMIN</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Имя" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Фамилия" name="surname">
            <Input />
          </Form.Item>
          <Form.Item label="Отчество" name="patronymic">
            <Input />
          </Form.Item>
          <Form.Item label="Подразделение" name="division">
            <Select>
              {divisions.map((div) => (
                <Option key={div} value={div}>
                  {div}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("passwordConfirmation") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Пароль и его подтверждение не совпадают")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Подтверждение пароля"
            name="passwordConfirmation"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("password") === value ||
                    !getFieldValue("password")
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Пароль и его подтверждение не совпадают")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={updateProfile_} loading={formDataIsSent}>
              Сохранить
            </Button>
            <Button onClick={resetEditing} style={{ marginLeft: 8 }}>
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </>
  );
});

export default Admin;
