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
import { deleteAccount, updateAccount } from "../http/userAPI";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Paragraph } = Typography;

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    deleteThisAccount();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    updateProfile();
    messageApi.open({
      type: "success",
      content: "Данные были обновленны",
    });
  };

  const deleteThisAccount = async () => {
    try {
      await deleteAccount(user.user.id);
      user.setUser({});
      user.setIsAuth(false);
      localStorage.removeItem("token");
      navigate(MAIN_ROUTE);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
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
  }

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
