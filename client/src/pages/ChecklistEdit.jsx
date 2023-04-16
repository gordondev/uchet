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
  Skeleton
} from "antd";
import { updateOne, fetchChecklist, deleteOne } from "../http/checklistAPI";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { fetchOneChecklist } from "../http/checklistAPI";
import { useParams, useNavigate } from "react-router-dom";
import { CHECKLIST_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";

const { Option } = Select;
const { Text } = Typography;
const { Paragraph } = Typography;

const ChecklistEdit = observer(() => {
  const [countVersion, setCountVersion] = useState(0);
  const [countRowsChecklist, setCountRowsChecklist] = useState(0);
  const [versionChecklist, setVersionChecklist] = useState(null);
  const [showRecondCounter, setShowRecondCounter] = useState(true);
  const [checklists, setChecklists] = useState([]);
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [checklist, setChecklist] = useState({ contents: [], user: [] });
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchVersionChecklist().then((response) => setVersion(response.rows));
    fetchChecklist().then((response) => setChecklists(response.rows));
    fetchOneChecklist(id).then((data) => {
      setChecklist(data);
      setDescription(data.description);
      setContent(data.checklist_contents);
      setName(data.name);
      setVersionChecklist(data.versionChecklistId);
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

  const updateChecklist = async () => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("versionChecklistId", versionChecklist);
    formData.append("description", description);
    formData.append("contents", JSON.stringify(content));
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
                        <Typography.Title
                          editable={{
                            onChange: setName,
                          }}
                          level={3}
                          style={{
                            margin: 0,
                            color: "#0e78ff",
                          }}
                        >
                          {name}
                        </Typography.Title>
                      </div>
                      <Form.Item
                        name="select"
                        label="Версия чек-листа"
                        hasFeedback
                        style={{ width: "100%" }}
                      >
                        <Select
                          placeholder={versionChecklist}
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
                              <Input.TextArea
                                showCount
                                maxLength={500}
                                defaultValue={`${i.content ? i.content : ""}`}
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
                          disabled={countRowsChecklist >= countVersion}
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
