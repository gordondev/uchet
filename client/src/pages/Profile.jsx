import React, { useContext } from "react";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Typography,
  Avatar,
  Modal
} from "antd";
import { Context } from "../index";
import { updateAccount } from "../http/userAPI";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';

const { Paragraph, Text, Title } = Typography;

const Profile = () => {
  const navigate = useNavigate();
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
  const [messageApi, contextHolder] = message.useMessage();
  const [modal2Open, setModal2Open] = useState(false);

  const success = () => {
    updateProfile();
    messageApi.open({
      type: "success",
      content: "Данные были обновленны",
    });
  };

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("name", editableStrFirstName);
    formData.append("surname", editableStrSerName);
    formData.append("patronymic", editableStrSecondName);
    try {
      await updateAccount(user.user.id, formData);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  return (
    <section className="mainSection">
      <div className="container">
        <div className="userForm">
          <Title
            level={4}
            style={{ margin: "0px 0px 20px 0px", textAlign: "center" }}
          >
            Профиль
          </Title>

          <div className="profile-container">
              <Avatar
              size={{
                xs: 24,
                sm: 32,
                md: 40,
                lg: 64,
                xl: 80,
                xxl: 100,
              }}
              icon={<UserOutlined />}
            />

            <div style={{ marginTop: "20px" }}>
              <Text style={{ marginRight: "4px" }}>{editableStrSerName}</Text>
              <Text style={{ marginRight: "4px" }}>{editableStrFirstName}</Text>
              <Text>{editableStrSecondName}</Text>
            </div>

            <Text>{"Подразделение: " + user.user.division}</Text>

            <Button style={{ marginTop: "20px" }} type="primary" onClick={() => setModal2Open(true)}>
              Изменить данные
            </Button>
          </div>

      <Modal
        title="Редактирование"
        centered
        open={modal2Open}
        footer={() => null}
        onCancel={() => setModal2Open(false)}
      >
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

          {contextHolder}
          <Button
            type="primary"
            htmlType="submit"
            onClick={success}
          >
            Сохранить
          </Button>
      </Modal>

          
        </div>
      </div>
    </section>
  );
};

export default Profile;
