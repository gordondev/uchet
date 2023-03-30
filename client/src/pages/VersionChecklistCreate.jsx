import React from "react";
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
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

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

const VersionChecklistCreate = () => {
  return (
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
              rules={[
                {
                  required: true,
                  message: "Выберите ключ-актуальности",
                },
              ]}
            >
              <Select>
                <Option value="value1">Актуально</Option>
                <Option value="value2">Не актуально</Option>
              </Select>
            </Form.Item>
          </div>
          <Title
            level={4}
            style={{ marginBottom: "20px", textAlign: "center" }}
          >
            Темы:
          </Title>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginBottom: "20px" }}
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
              <p className="ant-upload-hint">Прикрепите файл шапки чек-листа</p>
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
              style={{ width: "100%", marginBottom: "20px" }}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VersionChecklistCreate;
