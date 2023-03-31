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
    SaveOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const props = {
  beforeUpload: (file) => {
    const isDoc = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isDoc) {
      message.error(`${file.name} это не docx файл`);
    }
    return isDoc || Upload.LIST_IGNORE;
  },
    multiple: false,
    action: "http://localhost:3000/versionchecklist/create",
    onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
            console.log(info.file, info.fileList);
        }
        if (status === "done") {
            message.success(`${info.file.name} файл успешно загружен`);
        } else if (status === "error") {
            message.error(`${info.file.name} ошибка загрузки файла`);
        }
    },
    onDrop(e) {
        console.log("Dropped files", e.dataTransfer.files);
    },
};

const config = {
    title: "Предупреждение!",
    content: ( <
        >
        <ReachableContext.Consumer>
        {(name) => `С текущей записи будет снят данный ключ`}
      </ReachableContext.Consumer> <
        />
    ),
};
let countTheme = 0;
const VersionChecklistCreate = () => {
    const [modal, contextHolder] = Modal.useModal();
    const [info, setInfo] = useState([]);
    const [count, setCount] = useState(1);

    const addInfo = () => {
        setCount(count + 1);
        setInfo([...info, { theme: "", number: Date.now() }]);
    };

    const removeInfo = (number) => {
        setCount(count - 1);
        setInfo(info.filter((i) => i.number !== number));
    };

    const changeInfo = (value, number) => {
        setInfo(
            info.map((i) => (i.number === number ? { ...i, theme: value } : i))
        );
    };

    return (
        <ReachableContext.Provider value="Light">
      <section className="searchSection">
        <div className="container">
        <Form>
          <div className="defaultForm">
            <div className="defaultForm__tile">
              <Form.Item label="Номер версии" style={{ marginBottom: "20px" }}>
                <InputNumber min={1} defaultValue={1} prefix="№" 
                  rules={[
                  {
                    required: true,
                    message: "Выберите номер версии",
                  },
                ]}
                />
              </Form.Item>
              <Form.Item
                name="select"
                label="Ключ актуальности"
                hasFeedback
                style={{ width: "400px" }}
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
              Темы
            </Title>
            {info.map((i) => (
              <div className="theme_item">
                <Form.Item
                  name={i.number}
                  label="Название темы"
                  style={{ marginTop: "23px", width: "100%"}}
                  rules={[
                    {
                      required: true,
                      message: 'Введите название темы',
                    },
                  ]}
                >
                <Input />
                </Form.Item>
                  <Button
                    type="primary"
                    danger
                    htmlType="submit"
                    style={{ marginLeft: "20px" }}
                    icon={<DeleteOutlined />}
                    onClick={() => removeInfo(i.number)}
                  >
                    Удалить
                  </Button>
              </div>
            ))}

            <Button
              type="primary"
              style={{ width: "100%", marginBottom: "20px" }}
              icon={<PlusOutlined />}
              onClick={addInfo}
              disabled={count >= 7}
            >
              Добавить, осталось: {6 - (count - 1)}
            </Button>
            <div className="defaultForm__dragBlock">
              <Dragger {...props} maxCount={1} style={{ marginBottom: "20px" }}>
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
              <Dragger {...props} maxCount={1}>
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
            <Form.Item label="Дата принятия" name="date-picker" rules={[
                    {
                      required: true,
                      message: 'Выберите дату принятия',
                    },
                  ]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Основание использования">
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Примечание">
              <TextArea rows={4} />
            </Form.Item>
              <Form.Item style={{ width: "100%" }}>
                <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                style={{ width: "100%", marginBottom: "20px" }}
              >
                Сохранить
              </Button>
              </Form.Item>
          </div>
        </Form>
          
        </div>
      </section>
      {contextHolder}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
    );
};

export default VersionChecklistCreate;