import React, { useState, useEffect } from 'react'
import {
  Typography,
  Form,
  Input,
  Select,
  Divider,
  Button,
  Empty,
  Skeleton
} from "antd";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { createChecklist } from "../http/checklistAPI";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

const ChecklistCreate = () => {
  const [description, setDescription] = useState('');
  const [showRecondCounter, setShowRecondCounter] = useState(false);
  const [countVersion, setCount] = useState(0);
  const [isLoadind, setIsLoading] = useState(true);
  const [version, setVersion] = useState([]);
  const [content, setContent] = useState([]);

  useEffect( () => {
    setIsLoading(true);
    fetchVersionChecklist().then(response => setVersion(response.rows));
    setIsLoading(false);
  }, []);

  const addContent = () => {
    setContent([...content, { content: "", id: Date.now() }]);
  };

  const removeContent = (id) => {
    setContent(content.filter((i) => i.id !== id));
  };

  return (
      <section className="searchSection">
        <div className="container">
          <Form>
            <div className="defaultForm">
              {isLoadind ? ( <Skeleton active /> ) : (
                <>
                <div className="defaultForm__tile">
                  <Form.Item
                    name="title"
                    label="Название темы"
                    style={{ width: "100%" }}
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
                        setCount(version.find(item => item.id === value).quanityType);
                        setShowRecondCounter(true);
                      }}
                    >
                        {
                          version.map(item => (
                            <Option value={item.id}>{item.id}</Option>    
                          ))
                        }
                    </Select>
                </Form.Item>

                {
                  showRecondCounter && <Text type="secondary">Осталось 0/{countVersion} записей</Text>
                }

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
                  // onChange={selectHeaderFile}
                  accept=".doc, .docx"
                />
                Прикрепите файл содержния чек-листа

                <Divider orientation="center">Содержния</Divider>

                {
                  content.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }

                {content.map((i) => (

                  <>

                  <div className="theme_item">
                    <Form.Item
                      name="intro"
                      label="Содержние"
                      rows={4}
                      style={{ marginTop: "23px", width: "100%" }}
                      rules={[
                        {
                          required: true,
                          message: 'Введите содержние',
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
  )
}

export default ChecklistCreate;