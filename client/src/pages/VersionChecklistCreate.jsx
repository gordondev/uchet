import React from "react";
import { useState } from "react";
import { createContext } from "react";
import {
  Typography,
  Form,
  Select,
  Button,
  message,
  Upload,
  InputNumber,
  DatePicker,
  Input,
  Modal,
} from "antd";
import {
  InboxOutlined,
  PlusOutlined,
  DeleteOutlined,
  RollbackOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const config = {
  title: "Предупреждение!",
  content: (
    <>
      <ReachableContext.Consumer>
        {(name) => `С текущей записи будет снят данный ключ`}
      </ReachableContext.Consumer>
    </>
  ),
};

const VersionChecklistCreate = () => {
  const [modal, contextHolder] = Modal.useModal();
  return (
    <ReachableContext.Provider value="Light">
      <section className="searchSection">
        <div className="container">
          <div className="defaultForm">
            <div className="defaultForm__tile">
              <Title
                className="blockWelcome__title"
                level={3}
                style={{ color: "#0e78ff", marginBottom: "20px" }}
              >
                Версия №135002
              </Title>
              <Form.Item
                name="select"
                label="Ключ актуальности"
                hasFeedback
                style={{ width: "300px" }}
                rules={[
                  {
                    required: true,
                    message: "Выберите ключ-актуальности",
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    if (value == "topical") {
                      modal.warning(config);
                    }
                  }}
                >
                  <Option value="topical">Актуально</Option>
                  <Option value="notRelevant">Не актуально</Option>
                </Select>
              </Form.Item>
            </div>
            <Title
              level={4}
              style={{ marginBottom: "20px", textAlign: "center" }}
            >
              Темы:
            </Title>
            <div className="theme_item">
              <p>1.</p>
              <Input placeholder="Название темы" allowClear />
              <Button
                type="primary"
                danger
                htmlType="submit"
                style={{ marginLeft: "20px" }}
                icon={<DeleteOutlined />}
              >
                Удалить
              </Button>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginBottom: "20px" }}
              icon={<PlusOutlined />}
            >
              Добавить
            </Button>
            <div className="defaultForm__dragBlock">
              <Dragger {...props} style={{ padding: "20px" }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Кликните или перетащите файл в область загрузки
                </p>
                <p className="ant-upload-hint">
                  Прикрепите файл шапки чек-листа
                </p>
              </Dragger>
              <Dragger {...props} style={{ padding: "20px" }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Кликните или перетащите файл в область загрузки
                </p>
                <p className="ant-upload-hint">
                  Прикрепите файл комментариев чек-листа
                </p>
              </Dragger>
            </div>
            <Form.Item
              label="Количество типов"
              style={{ marginTop: "20px", width: "100%" }}
            >
              <InputNumber
                min={1}
                max={10}
                defaultValue={1}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Дата принятия">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Основание использования">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Примечание">
              <TextArea rows={4} />
            </Form.Item>
            <div className="defaultForm__buttonsBottom">
              <Button
                type="primary"
                htmlType="submit"
                icon={<RollbackOutlined />}
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  marginRight: "20px",
                }}
              >
                Назад
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ width: "100%", marginBottom: "20px" }}
              >
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </section>
      {contextHolder}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  );
};

export default VersionChecklistCreate;
