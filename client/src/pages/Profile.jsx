import React, { useContext } from "react";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Modal,
  message,
  Typography,
} from "antd";
import { Context } from "../index";

const { Title } = Typography;
const { Paragraph } = Typography;

const Profile = () => {
  const { user } = useContext(Context);
  const [editableStrSerName, setEditableSerName] = useState(
    `${user?.user?.surname}`
  );
  const [editableStrFirstName, setEditableFirstName] = useState(
    `${user?.user?.name}`
  );
  const [editableStrSecondName, setEditableSecondName] = useState(
    `${user?.user?.patronymic}`
  );

  const [componentDisabled, setComponentDisabled] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Данные были успешно сохраненны",
    });
  };

  return (
    <section className="mainSection">
      <div className="container">
        <div className="userForm">
          <Title
            level={4}
            style={{ margin: "0px 0px 20px 0px", textAlign: "center" }}
          >
            Личные данные
          </Title>
          <Paragraph
            editable={{
              onChange: setEditableSerName,
            }}
          >
            {editableStrSerName}
          </Paragraph>
          <Paragraph
            editable={{
              onChange: setEditableFirstName,
            }}
          >
            {editableStrFirstName}
          </Paragraph>
          <Paragraph
            editable={{
              onChange: setEditableSecondName,
            }}
          >
            {editableStrSecondName}
          </Paragraph>
          <Checkbox
            checked={componentDisabled}
            onChange={(e) => setComponentDisabled(e.target.checked)}
            style={{ marginBottom: "20px" }}
          >
            Не менять пароль
          </Checkbox>
          <Form disabled={componentDisabled}>
            <Form.Item
              name="password"
              label="Старый пароль"
              rules={[
                {
                  required: true,
                  message: "Введите старый пароль",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Новый пароль"
              rules={[
                {
                  required: true,
                  message: "Введите новый пароль",
                },
              ]}
              hasFeedback
            >
              <Input.Password />
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
              <Input.Password />
            </Form.Item>
          </Form>
          {contextHolder}
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginBottom: "20px" }}
            onClick={success}
          >
            Сохранить
          </Button>
          <Button
            type="primary"
            danger
            style={{ width: "100%" }}
            onClick={showModal}
          >
            Удалить аккаунт
          </Button>
          <Modal
            title="Удаление учетной записи!"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Данная учетная запись будет удалена безвозвратно, продолжить?</p>
          </Modal>
        </div>
      </div>
    </section>
  );
};

export default Profile;
