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
    message,
    Upload
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { createChecklist } from "../http/checklistAPI";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

const ChecklistCreate = () => {
    const { user } = useContext(Context);
    const [description, setDescription] = useState("");
    const [content, setContent] = useState([]);
    const [name, setName] = useState("");
    const [versionChecklist, setVersionChecklist] = useState(null);
    const [file, setFile] = useState("");
    const [checklists, setChecklists] = useState([]);

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

    const props = {
      name: 'file',
      multiple: false,
      maxCount: 1,
    }

    const beforeUploadFile = (file) => {
      const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        message.error('Вы можете загрузить только .docx файл');
      } else {
        setFile(file);
      }
      return !isDocx;
    };

    const removeFile = () => {
      setFile('');
    }

    return (
        <section className="searchSection">
      <div className="container">
        <Form onFinish={addChecklist}>
          <div className="defaultForm">
                <div className="defaultForm__tile">
                  <Form.Item
                    name="title"
                    label="Название темы"
                    style={{ width: "100%", marginRight: "10px" }}
                    onChange={(e) => setName(e.target.value)}
                    rules={[
                      {
                        required: true,
                        message: "Введите название чек-листа",
                      },
                    ]}
                  >
                    <Input placeholder="Введите название темы" allowClear/>
                  </Form.Item>

                  <Form.Item
                    name="version"
                    label="Версиия"
                    style={{ width: "100%", marginLeft: "10px"}}
                    onChange={(e) => setVersionChecklist(e.target.value)}
                    rules={[
                      {
                        required: true,
                        message: "Введите версию чек-листа",
                      },
                    ]}
                  >
                    <Input placeholder="Введите версию чек-листа" type="number" allowClear/>
                  </Form.Item>
                </div>

                <Form.Item 
                  label="Описание"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Введите описание",
                    },
                  ]}
                >
                <TextArea
                  allowClear
                  rows={4}
                  onChange={(e) => setDescription(e.target.value)}
                  showCount
                  placeholder="Введите описание"
                  maxLength={500}
                />
                </Form.Item>

                <Dragger {...props}  beforeUpload={beforeUploadFile} onRemove={removeFile}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Нажмите или перетащите файл в область загрузки</p>
                  <p className="ant-upload-hint">
                    Прикрепите файл содержания в формате .doc или .docx
                  </p>
                </Dragger>
                
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
                        <Input showCount maxLength={500} allowClear/>
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
          </div>
        </Form>
      </div>
    </section>
    );
};

export default ChecklistCreate;