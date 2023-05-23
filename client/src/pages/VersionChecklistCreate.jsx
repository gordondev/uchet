import React, { useContext, useState, createContext } from "react";
import { createVersion } from "../http/versionChecklistAPI";
import { Context } from "../index";
import {
  Form,
  Select,
  Button,
  InputNumber,
  DatePicker,
  Input,
  message,
  Modal,
  Divider,
  Empty,
  Upload,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import shortid from 'shortid';
import { debounce } from 'lodash';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Option } = Select;

const ReachableContext = createContext(null);
const UnreachableContext = createContext(null);

const fileTypeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fileTypeDoc = "application/msword";

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

const VersionChecklistCreate = observer(() => {
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
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState([]);
  const [dataIsSent, setDataIsSent] = useState(false);

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { theme: "", number: shortid.generate() }]);
  };

  const removeTheme = (number) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.number !== number));
  };

  const changeTheme = debounce((value, number) => {
    setTheme(
      theme.map((i) => (i.number === number ? { ...i, ["theme"]: value } : i))
    );
  }, 500);

  const addVersion = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("actualKey", actualKey);
    formData.append("userId", user.user.id);
    formData.append("quanityType", quanityType);
    formData.append("reasonForUse", reasonForUse);
    formData.append("acceptanceDate", acceptanceDate);
    formData.append("comment", comment);
    formData.append("title", title);
    formData.append("theme", JSON.stringify(theme));
    formData.append("headerFile", headerFile);
    formData.append("commentFile", commentFile);
    try {
      await createVersion(formData);
      message.success(`Версия успешно добавлена`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  const beforeUploadHeaderFile = (file) => {
    const isDocx =
      file.type ===
      fileTypeDocx;
    const isDoc = file.type ===
      fileTypeDoc;

    if (!isDocx && !isDoc) {
      message.error("Вы можете загрузить только .docx .doc файл");
    } else {
      setHeaderFile(file);
    }
    return !isDocx && !isDoc;
  };

  const removeHeaderFile = () => {
    setHeaderFile("");
  };

  const beforeUploadCommentFile = (file) => {
    const isDocx =
      file.type ===
      fileTypeDocx;
    const isDoc = file.type ===
      fileTypeDoc;
      
    if (!isDocx && !isDoc) {
      message.error("Вы можете загрузить только .docx .doc файл");
    } else {
      setCommentFile(file);
    }
    return !isDocx && !isDoc;
  };

  const removeCommentFile = () => {
    setCommentFile("");
  };

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
  };

  return (
    <ReachableContext.Provider value="Light">
      <section className="searchSection">
        <div className="container">
          <Form onFinish={addVersion}>
            <div className="defaultForm">
              <div className="defaultForm__tile">
                <Form.Item
                  name="id"
                  label="Номер версии"
                  style={{ marginBottom: "20px" }}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Выберите номер версии",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    prefix="№"
                    style={{ width: "200px" }}
                    placeholder="Введите № версии"
                    onChange={debounce((value) => setId(value), 500)}
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
                      message: "Выберите ключ актуальности",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Выберите ключ актуальности"
                    onChange={(value) => {
                      setActualKey(value);
                      if (value === "Актуально") {
                        modal.warning(config);
                      }
                    }}
                  >
                    <Option value="Актуально">Актуально</Option>
                    <Option value="Не актуально">Не актуально</Option>
                  </Select>
                </Form.Item>
              </div>
              <Form.Item
                name="title"
                label="Название версии"
                rules={[
                  {
                    required: true,
                    message: "Введите название версии",
                    whitespace: true,
                  },
                ]}
                onChange={debounce((e) => setTitle(e.target.value), 500)}
              >
                <Input allowClear placeholder="Введите название версии" />
              </Form.Item>
              <Divider orientation="center">Темы</Divider>
              {theme.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}

              <TransitionGroup>
              {theme.map((i) => (
                <CSSTransition key={i.number} timeout={500} classNames="point">
                <div className="theme_item">
                  <Form.Item
                    key={i.number}
                    name={i.number}
                    label="Название темы: "
                    style={{ marginTop: "23px", width: "100%" }}
                    onChange={(e) => changeTheme(e.target.value, i.number)}
                    rules={[
                      {
                        required: true,
                        message: "Введите название темы",
                      },
                    ]}
                  >
                    <Input allowClear showCount maxLength={500}/>
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
                </CSSTransition>
              ))}
              </TransitionGroup>

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
                <Dragger
                  {...props}
                  beforeUpload={beforeUploadHeaderFile}
                  onRemove={removeHeaderFile}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Нажмите или перетащите файл в область загрузки
                  </p>
                  <p className="ant-upload-hint">
                    Прикрепите файл шапки в формате .doc или .docx
                  </p>
                </Dragger>

                <br />

                <Dragger
                  {...props}
                  beforeUpload={beforeUploadCommentFile}
                  onRemove={removeCommentFile}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Нажмите или перетащите файл в область загрузки
                  </p>
                  <p className="ant-upload-hint">
                    Прикрепите файл комментария в формате .doc или .docx
                  </p>
                </Dragger>
              </div>
              <Form.Item
                name="quanityType"
                label="Количество типов"
                style={{ marginTop: "20px", width: "100%" }}
                rules={[
                  {
                    required: true,
                    message: "Выберите количество типов",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="Количество типов(max: 10)"
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
                  allowClear
                  placeholder="Выберите дату"
                  style={{ width: "100%" }}
                  onChange={debounce((date, dateString) => {
                    setAcceptanceDate(dateString);
                  }, 500)}
                />
              </Form.Item>
              <Form.Item
                name="reasonForUse"
                label="Основание использования"
                rules={[
                  {
                    required: true,
                    message: "Напишите основание использования",
                  },
                ]}
              >
                <TextArea
                  allowClear
                  rows={4}
                  onChange={debounce((e) => setReasonForUse(e.target.value), 500)}
                  showCount
                  placeholder="Введите основание использования"
                  maxLength={500}
                />
              </Form.Item>
              <Form.Item
                label="Примечание"
                name="comment"
                rules={[
                  {
                    required: true,
                    message: "Напишите примечание",
                  },
                ]}
              >
                <TextArea
                  allowClear
                  rows={4}
                  onChange={debounce((e) => setComment(e.target.value), 500)}
                  showCount
                  placeholder="Введите примечание"
                  maxLength={500}
                />
              </Form.Item>
              <Form.Item style={{ width: "100%" }}>
                <Button
                  type="primary"
                  loading={dataIsSent}
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  style={{ width: "100%" }}
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
});

export default VersionChecklistCreate;
