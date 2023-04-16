import React, { useState, useEffect, useContext } from "react";
import { Context } from "../index";
import {
  Typography,
  Form,
  Input,
  Select,
  Divider,
  Button,
  Empty,
  Skeleton,
  message,
} from "antd";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { createChecklist, fetchChecklist } from "../http/checklistAPI";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const ChecklistCreate = () => {
  const { user } = useContext(Context);
  const [description, setDescription] = useState("");
  const [showRecondCounter, setShowRecondCounter] = useState(false);
  const [countVersion, setCountVersion] = useState(0);
  const [countRowsChecklist, setCountRowsChecklist] = useState(0);
  const [isLoadind, setIsLoading] = useState(true);
  const [version, setVersion] = useState([]);
  const [content, setContent] = useState([]);
  const [name, setName] = useState("");
  const [versionChecklist, setVersionChecklist] = useState(null);
  const [file, setFile] = useState("");
  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchChecklist().then((response) => setChecklists(response.rows));
    fetchVersionChecklist().then((response) => setVersion(response.rows));
    setIsLoading(false);
  }, []);

  const addContent = () => {
    setContent([...content, { content: "", id: Date.now() }]);
  };

  const removeContent = (id) => {
    setContent(content.filter((i) => i.id !== id));
  };

  const changeContent = (value, id) => {
    setContent(
      content.map((i) => (i.id === id ? { ...i, ["content"]: value } : i))
    );
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
    console.log("FILE", e.target.files[0]);
  };

  const addChecklist = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("versionChecklistId", versionChecklist);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("userId", user.user.id);
    formData.append("contents", JSON.stringify(content));
    try {
      await createChecklist(formData);
      message.success(`Чек-лист был добавлен`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  return (
    <section className="searchSection">
      <div className="container">
        <Form onFinish={addChecklist}>
          <div className="defaultForm">
            {isLoadind ? (
              <Skeleton active />
            ) : (
              <>
                <div className="defaultForm__tile">
                  <Form.Item
                    name="title"
                    label="Название темы"
                    style={{ width: "100%" }}
                    onChange={(e) => setName(e.target.value)}
                    rules={[
                      {
                        required: true,
                        message: "Введите название чек-листа",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item
                  name="select"
                  label="Версия чек-листа"
                  hasFeedback
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Выберите версию",
                    },
                  ]}
                >
                  <Select
                    onChange={(value) => {
                      setCountVersion(
                        version.find((item) => item.id === value).quanityType
                      );
                      setCountRowsChecklist(
                        checklists.filter((i) => i.versionChecklistId === value)
                          .length
                      );
                      setVersionChecklist(value);
                      setShowRecondCounter(true);
                    }}
                  >
                    {version.map((item) => (
                      <Option value={item.id}>{item.id}</Option>
                    ))}
                  </Select>
                </Form.Item>
                {showRecondCounter && (
                  <Text type="secondary">
                    <p className="counter">
                      {countRowsChecklist}/{countVersion} записей
                    </p>
                  </Text>
                )}
                <Form.Item label="Описание">
                  <TextArea
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
                <input
                  type="file"
                  className="inputUpload"
                  onChange={selectFile}
                  accept=".doc, .docx"
                />
                Прикрепите файл содержния чек-листа
                <Divider orientation="center">Содержния</Divider>
                {content.length === 0 && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
                {content.map((i) => (
                  <>
                    <div className="theme_item">
                      <Form.Item
                        name={i.id}
                        label="Содержние"
                        rows={4}
                        style={{ marginTop: "23px", width: "100%" }}
                        onChange={(e) => changeContent(e.target.value, i.id)}
                        rules={[
                          {
                            required: true,
                            message: "Введите содержние",
                          },
                        ]}
                      >
                        <Input.TextArea showCount maxLength={500} />
                      </Form.Item>

                      <Button
                        type="primary"
                        danger
                        style={{ marginLeft: "20px" }}
                        icon={<DeleteOutlined />}
                        onClick={() => removeContent(i.id)}
                      >
                        Удалить
                      </Button>
                    </div>
                  </>
                ))}
                <Button
                  type="primary"
                  style={{ width: "100%", marginBottom: "20px" }}
                  icon={<PlusOutlined />}
                  onClick={addContent}
                  disabled={countRowsChecklist >= countVersion}
                >
                  Добавить
                </Button>
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
  );
};

export default ChecklistCreate;
