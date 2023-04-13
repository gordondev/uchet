import React, { useContext, useState, createContext } from "react";
import { createVersion } from "../http/versionChecklistAPI";
import { Context } from "../index";
import {
  Typography,
  Form,
  Select,
  Button,
  InputNumber,
  DatePicker,
  Input,
  message,
  Modal,
  Divider,
  Empty
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const config = {
  title: "Предупреждение!",
  content: (
    <>
      <ReachableContext.Consumer>
        {(name) => `С текущей записи будет снят данный ключ`}
      </ReachableContext.Consumer>{" "}
    </>
  ),
};

const VersionChecklistCreate = () => {
  const [modal, contextHolder] = Modal.useModal();
  const [count, setCount] = useState(1);
  const { user } = useContext(Context);

  const [id, setId] = useState(1);
  const [actualKey, setActualKey] = useState("");
  const [quanityType, setQuanityType] = useState(1);
  const [acceptanceDate, setAcceptanceDate] = useState("");
  const [reasonForUse, setReasonForUse] = useState("");
  const [comment, setComment] = useState("");
  const [headerFile, setHeaderFile] = useState("");
  const [commentFile, setCommentFile] = useState("");
  const [theme, setTheme] = useState([]);
  const [form] = Form.useForm();

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { theme: "", number: Date.now() }]);
  };

  const removeTheme = (number) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.number !== number));
  };

  const changeTheme = (value, number) => {
    setTheme(
      theme.map((i) => (i.number === number ? { ...i, ["theme"]: value } : i))
    );
  };

  const addVersion = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("actualKey", actualKey);
    formData.append("userId", user.user.id);
    formData.append("quanityType", quanityType);
    formData.append("reasonForUse", reasonForUse);
    formData.append("acceptanceDate", acceptanceDate);
    formData.append("comment", comment);
    formData.append("theme", JSON.stringify(theme));
    formData.append("headerFile", headerFile);
    formData.append("commentFile", commentFile);
    try {
      await createVersion(formData);
      message.success(`Версия успешно добавлена`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  const selectHeaderFile = (e) => {
    setHeaderFile(e.target.files[0]);
    console.log("HEADER FILE", e.target.files[0]);
  };

  const selectCommentFile = (e) => {
    setCommentFile(e.target.files[0]);
    console.log("COMMENT FILE", e.target.files[0]);
  };

  return (
    <ReachableContext.Provider value="Light">
      <section className="searchSection">
        <div className="container">
          <Form onFinish={addVersion}>
            <div className="defaultForm">
              <div className="defaultForm__tile">
                <Form.Item
                  label="Номер версии"
                  style={{ marginBottom: "20px" }}
                >
                  <InputNumber
                    min={1}
                    defaultValue={1}
                    prefix="№"
                    onChange={(value) => setId(value)}
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
                      setActualKey(value);
                      if (value == "Актуально") {
                        modal.warning(config);
                      }
                    }}
                  >
                    <Option value="Актуально">Актуально</Option>
                    <Option value="Не актуально">Не актуально</Option>
                  </Select>
                </Form.Item>
              </div>
              <Divider orientation="center">Темы</Divider>
              {
                  theme.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              }
              {theme.map((i) => (
                <div className="theme_item">
                  <Form.Item
                    name={i.number}
                    label="Название темы"
                    style={{ marginTop: "23px", width: "100%" }}
                    onChange={(e) => changeTheme(e.target.value, i.number)}
                    rules={[
                      {
                        required: true,
                        message: "Введите название темы",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Button
                    type="primary"
                    danger
                    style={{ marginLeft: "20px" }}
                    icon={<DeleteOutlined />}
                    onClick={() => removeTheme(i.number)}
                  >
                    Удалить
                  </Button>
                </div>
              ))}

              <Button
                type="primary"
                style={{ width: "100%", marginBottom: "20px" }}
                icon={<PlusOutlined />}
                onClick={addTheme}
                disabled={count >= 7}
              >
                Добавить, осталось: {6 - (count - 1)}
              </Button>
              <div className="defaultForm__dragBlock">
                <input
                  type="file"
                  className="inputUpload"
                  onChange={selectHeaderFile}
                  accept=".doc, .docx"
                />{" "}
                Выбор шапки
                <br />
                <input
                  type="file"
                  className="inputUpload"
                  onChange={selectCommentFile}
                  accept=".doc, .docx"
                />{" "}
                Выбор комментария
              </div>
              <Form.Item
                label="Количество типов"
                style={{ marginTop: "20px", width: "100%" }}
              >
                <InputNumber
                  min={1}
                  max={10}
                  defaultValue={1}
                  onChange={(value) => setQuanityType(value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                label="Дата принятия"
                name="date-picker"
                rules={[
                  {
                    required: true,
                    message: "Выберите дату",
                  },
                ]}
              >
                <DatePicker
                  placeholder="Выберите дату"
                  style={{ width: "100%" }}
                  onChange={(date, dateString) => {
                    setAcceptanceDate(dateString);
                  }}
                />
              </Form.Item>
              <Form.Item label="Основание использования">
                <TextArea
                  rows={4}
                  onChange={(e) => setReasonForUse(e.target.value)}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
              <Form.Item label="Примечание">
                <TextArea
                  rows={4}
                  onChange={(e) => setComment(e.target.value)}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
              <Form.Item style={{ width: "100%" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ width: "100%"}}
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
