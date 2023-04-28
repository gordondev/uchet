import React, { useState, useEffect } from "react";
import {
  Typography,
  Form,
  Select,
  Button,
  Input,
  message,
  Modal,
  Divider,
  Empty,
  Skeleton,
  List,
  Upload,
} from "antd";
import { updateOne, fetchChecklist, deleteOne } from "../http/checklistAPI";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { PlusOutlined, DeleteOutlined, SaveOutlined, UploadOutlined, FileWordOutlined } from "@ant-design/icons";
import { fetchOneChecklist } from "../http/checklistAPI";
import { useParams, useNavigate } from "react-router-dom";
import { CHECKLIST_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const { Option } = Select;
const { Text } = Typography;
const { Paragraph } = Typography;

const ChecklistEdit = observer(() => {
  const [versionChecklist, setVersionChecklist] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [checklist, setChecklist] = useState({ contents: [], user: [] });
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [versionChecklistId, setVersionChecklistId] = useState(null);
  const [file, setFile] = useState('');
  const [nameFile, setNameFile] = useState('');
  const [fileIsDeleted, setFileIsDeleted] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchChecklist().then((response) => setChecklists(response.rows));
    fetchOneChecklist(id).then((data) => {
      setChecklist(data);
      setDescription(data.description);
      setContent(data.checklist_contents);
      setName(data?.name);
      setNameFile(data?.checklist_files[0]?.name);
      setVersionChecklistId(data?.versionChecklistId);
    });
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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    deleteChecklist();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const props = {
    name: 'file',
    multiple: false,
    maxCount: 1,
  }

  const beforeUploadFile = (file_) => {
      const isDocx = file_.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        message.error('Вы можете загрузить только .docx файл');
      } else {
        setNameFile(file_.name);
        setFile(file_);
        setFileIsDeleted('');
      }
      return !isDocx;
  };

  const updateChecklist = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("versionChecklistId", versionChecklistId);
    formData.append("description", description);
    formData.append("contents", JSON.stringify(content));
    formData.append("file", file);
    formData.append("fileIsDeleted", fileIsDeleted);
    try {
      await updateOne(id, formData);
      message.success(`Данные были обновленны`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  const deleteChecklist = async () => {
    try {
      await deleteOne(id);
      navigate(CHECKLIST_ROUTE);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  return (
    <section className="searchSection">
      <div className="container">
        <Form onFinish={updateChecklist}>
          <div className="defaultForm">
          {isLoadind ? (
                  <>
                    <Skeleton active="true" />
                    <br />
                    <Skeleton active="true" />
                  </>
                ) : (
                  <>
                      <div className="defaultForm__tile">
                        <Form.Item
                          name="title"
                          label="Название темы"
                          style={{ width: "100%", marginRight: "10px" }}
                          onChange={(e) => setName(e.target.value)}
                        >
                          <Input placeholder={name} allowClear/>
                        </Form.Item>

                        <Form.Item
                          name="version"
                          label="Версиия"
                          style={{ width: "100%", marginLeft: "10px"}}
                          onChange={(e) => setVersionChecklistId(e.target.value)}
                        >
                          <Input placeholder={versionChecklistId} type="number" allowClear/>
                        </Form.Item>
                      </div>
                      <Divider orientation="center">Описание</Divider>
                      <Paragraph
                        style={{ marginBottom: "20px" }}
                        editable={{
                          onChange: setDescription,
                          maxLength: 500,
                          autoSize: {
                            maxRows: 5,
                            minRows: 4,
                          },
                        }}
                      >
                        {description}
                      </Paragraph>
                      <Divider orientation="center">Содержания</Divider>
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
                            >
                              <Input showCount maxLength={500} placeholder={`${i.content ? i.content : ""}`} allowClear/>
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

                      <List
                        size="large"
                        bordered
                        style={{ marginBottom: "20px"}}
                      >
                      <List.Item>
                        { nameFile ?
                          <>
                            <Text type="secondary">
                            <FileWordOutlined /> {nameFile}
                            </Text>
                            <Button
                              type="primary"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {setNameFile(null); setFile(null); setFileIsDeleted(true)}}
                            >
                              Удалить
                            </Button>
                          </> :
                          <>
                            <Text type="secondary">
                            <FileWordOutlined /> Прикрепите файл содержания
                            </Text>
                            <Upload {...props} beforeUpload={beforeUploadFile}>
                              <Button icon={<UploadOutlined />}>Нажмите для загрузки .doc .docx</Button>
                            </Upload>
                          </>
                        }
                      </List.Item>
                    </List>

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
                      <Form.Item style={{ width: "100%" }}>
                        <Button
                          type="primary"
                          danger
                          style={{ width: "100%" }}
                          icon={<DeleteOutlined />}
                          onClick={showModal}
                        >
                          Удалить
                        </Button>
                      </Form.Item>
                      <Modal
                        title="Удаление чек-листа!"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                      >
                        <p>Данные будут удалены безвозвратно, продолжить?</p>
                      </Modal>
            </>
          )}
          </div>
        </Form>
      </div>
    </section>
  );
});

export default ChecklistEdit;
