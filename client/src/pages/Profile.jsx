import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  message,
  Typography,
  Avatar,
  Modal,
  Upload
} from "antd";
import { Context } from "../index";
import { updateAccount, getImageInfo } from "../http/userAPI";
import { MAIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Paragraph, Text, Title } = Typography;

const fileTypeJPG = "image/jpeg";
const fileTypePNG = "image/png";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [file, setFile] = useState("");

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
  const [dataIsSent, setDataIsSent] = useState(false);

  const success = () => {
    updateProfile();
    messageApi.open({
      type: "success",
      content: "Данные были обновленны",
    });
  };

  const updateProfile = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("name", editableStrFirstName);
    formData.append("surname", editableStrSerName);
    formData.append("patronymic", editableStrSecondName);
    formData.append("file", file);
    try {
      const userData = await updateAccount(user.user.id, formData);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  useEffect(() => {
    getImageInfo(user.user.id).then((data) => {
      setFile(data);
    });
  }, [dataIsSent]);

  const imageURL = `${process.env.REACT_APP_API_URL}/${file.id}.${file.fileExtension}`;

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
  };

  const beforeUploadFile = (file) => {
    const isJPG =
      file.type ===
      fileTypeJPG;
    const isPNG = file.type ===
      fileTypePNG;
      
    if (!isJPG && !isPNG) {
      message.error("Вы можете загрузить только .jpg .png файл");
    } else {
      setFile(file);
    }
    return !isJPG && !isPNG;
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
              src={imageURL}
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

          <Upload {...props} beforeUpload={beforeUploadFile}>
            <Button icon={<UploadOutlined />}>
              Нажмите для загрузки .jpg .png
            </Button>
          </Upload>

          {contextHolder}
          <Button
            loading={dataIsSent}
            style={{ marginTop: "20px"}}
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
