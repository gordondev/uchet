import React, { useState, useEffect, createContext } from "react";
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
  Skeleton,
  Divider,
} from "antd";
import {
  FileWordOutlined,
  DownloadOutlined,
  CheckOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchOneVersion } from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";

const { TextArea } = Input;
const { Option } = Select;

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

const VersionChecklistEdit = observer(() => {
  const [modal, contextHolder] = Modal.useModal();
  const { id } = useParams();
  const [currentId, setCurrentId] = useState(id);
  const [version, setVersion] = useState({ themes: [], user: [] });
  const [actualKey, setActualKey] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState([]);
  const [count, setCount] = useState(0);
  const [headerFile, setHeaderFile] = useState("");
  const [commentFile, setCommentFile] = useState("");
  const [quanityType, setQuanityType] = useState(1);
  const [acceptanceDate, setAcceptanceDate] = useState("");
  const [reasonForUse, setReasonForUse] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchOneVersion(id).then((data) => {
      setVersion(data);
      setActualKey(data.actualKey);
      setTheme(data.themes);
      setQuanityType(data.quanityType);
      setCount(data.themes.length);
    });
    setIsLoading(false);
  }, []);

  console.log(version);

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { theme: "", id: Date.now() }]);
  };

  const removeTheme = (id) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.id !== id));
  };

  const changeTheme = (value, id) => {
    setTheme(theme.map((i) => (i.id === id ? { ...i, ["theme"]: id } : i)));
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
          <Form>
            <div className="defaultForm">
              <div className="defaultForm__tile">
                {loading ? (
                  <>
                    <Skeleton.Input active="true" size="400" />
                    <Skeleton.Input active="true" size="400" />
                  </>
                ) : (
                  <>
                    <Form.Item
                      label="Номер версии"
                      style={{ marginBottom: "20px" }}
                    >
                      <InputNumber
                        min={1}
                        placeholder={currentId}
                        prefix="№"
                        onChange={(value) => setCurrentId(value)}
                        rules={[
                          {
                            required: true,
                            message: "Выберите номер версии",
                          },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name="selectActualKey"
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
                        name="selectActualKey"
                        placeholder={`${actualKey}`}
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
                  </>
                )}
              </div>
              {loading ? (
                <>
                  <Skeleton active="true" />
                  <br />
                  <Skeleton active="true" />
                </>
              ) : (
                <>
                  <Divider orientation="center">Темы</Divider>
                  {theme.map((i) => (
                    <div className="theme_item">
                      <Form.Item
                        name={i.id}
                        label="Название темы"
                        placeholder="Error"
                        style={{ marginTop: "23px", width: "100%" }}
                        onChange={(e) => changeTheme(e.target.value, i.id)}
                        rules={[
                          {
                            required: true,
                            message: "Введите название темы",
                          },
                        ]}
                      >
                        <Input placeholder={`${i.title}`} />
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
                    disabled={count >= 6}
                  >
                    Добавить, осталось: {6 - count}
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
                      placeholder={quanityType}
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
                      placeholder={version.acceptanceDate}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        setAcceptanceDate(dateString);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Основание использования">
                    <TextArea
                      rows={4}
                      placeholder={version.reasonForUse}
                      onChange={(e) => setReasonForUse(e.target.value)}
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                  <Form.Item label="Примечание">
                    <TextArea
                      rows={4}
                      placeholder={version.comment}
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
                      style={{ width: "100%" }}
                    >
                      Сохранить
                    </Button>
                  </Form.Item>
                </>
              )}
            </div>
          </Form>
        </div>
      </section>
      {contextHolder}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  );
});

export default VersionChecklistEdit;
