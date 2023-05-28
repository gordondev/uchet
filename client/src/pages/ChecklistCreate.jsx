import React, { useState, useEffect, useContext } from "react";
import { Context } from "../index";
import {
  Form,
  Input,
  Select,
  Divider,
  Button,
  Empty,
  message,
  Upload,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { createChecklist } from "../http/checklistAPI";
import { getThemes } from "../http/versionChecklistAPI";
import shortid from 'shortid';
import { debounce } from 'lodash';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useParams } from "react-router-dom";

const fileTypeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fileTypeDoc = "application/msword";

const { TextArea } = Input;
const { Dragger } = Upload;

const ChecklistCreate = () => {
  const { user } = useContext(Context);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [themeId, setThemeId] = useState();
  const [file, setFile] = useState("");
  const [dataIsSent, setDataIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getThemes(id).then((data) => {
      const updatedData = data.map((item) => {
        return { ...item, value: item.title };
      });
      setThemes(updatedData);
      setIsLoading(false);
    });
  }, []);

  const addContent = () => {
    setContent([...content, { content: "", id: shortid.generate() }]);
  };

  const removeContent = (id) => {
    setContent(content.filter((i) => i.id !== id));
  };

  const changeContent = (value, id) => {
    setContent(
      content.map((i) => (i.id === id ? { ...i, content: value } : i))
    );
  };

  const addChecklist = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("themeId", themeId);
    formData.append("versionChecklistId", id);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("userId", user.user.id);
    formData.append("contents", JSON.stringify(content));
    try {
      await createChecklist(formData, id);
      message.success(`Чек-лист был добавлен`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
  };

  const beforeUploadFile = (file) => {
    const isDocx =
      file.type ===
      fileTypeDocx;
    const isDoc = file.type ===
      fileTypeDoc;
      
    if (!isDocx && !isDoc) {
      message.error("Вы можете загрузить только .docx .doc файл");
    } else {
      setFile(file);
    }
    return !isDocx && !isDoc;
  };

  const removeFile = () => {
    setFile("");
  };

  return (
    <section className="searchSection">
      <div className="container">
        <Form onFinish={addChecklist}>
          <div className="defaultForm">
            <div className="defaultForm__tile">
              <Form.Item
                  name="select"
                  label="Темы"
                  hasFeedback
                  style={{ width: "100%" }}
                  rules={[
                    {
                      required: true,
                      message: "Выберите тему",
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder="Выберите тему"
                    options={themes}
                    onChange={(value) => {
                      const selectedTheme = themes.find((theme) => theme.value === value);
                      setThemeId(selectedTheme.id);
                    }}
                  >
                  </Select>
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
                onChange={debounce((e) => setDescription(e.target.value), 500)}
                showCount
                placeholder="Введите описание"
                maxLength={1000}
              />
            </Form.Item>

            <Dragger
              {...props}
              beforeUpload={beforeUploadFile}
              onRemove={removeFile}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Нажмите или перетащите файл в область загрузки
              </p>
              <p className="ant-upload-hint">
                Прикрепите файл содержания в формате .doc или .docx
              </p>
            </Dragger>

            <Divider orientation="center">Содержния</Divider>
            {content.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <TransitionGroup>
            {content.map((i, index) => (
              <CSSTransition key={i.id} timeout={500} classNames="point">
                <div className="theme_item">
                  <Form.Item
                    name={i.id}
                    label={`Содержание ${index + 1}:`}
                    rows={4}
                    style={{ marginTop: "23px", width: "100%" }}
                    onChange={(e) => changeContent(e.target.value, i.id)}
                    rules={[
                      {
                        required: true,
                        message: "Введите содержание",
                      },
                    ]}
                  >
                    <TextArea
                      rows={2}
                      showCount
                      maxLength={1000}
                      placeholder="Введите содержание"
                      allowClear
                    />
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
              </CSSTransition>
            ))}
            </TransitionGroup>
            
            <Button
              type="primary"
              style={{ marginBottom: "20px" }}
              icon={<PlusOutlined />}
              onClick={addContent}
            >
              Добавить
            </Button>
            <Form.Item style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={dataIsSent}
                icon={<SaveOutlined />}
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
