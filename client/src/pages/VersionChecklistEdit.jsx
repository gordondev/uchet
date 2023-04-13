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
  Empty
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneVersion, deleteOne, updateOne } from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_ROUTE } from "../utils/consts";

const { Option } = Select;
const { Paragraph } = Typography;

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
  const [updateId, setUpdateId] = useState(id);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    deleteVersion();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteVersion = async () => {
    try {
      await deleteOne(id);
      navigate(VERSION_CHECKLIST_ROUTE);
    } catch(e) {
      message.error(e.response?.data?.message);
    }
  }

  const updateVersion = async () => {
    const formData = new FormData();
    formData.append("updateId", updateId);
    formData.append("id", id);
    formData.append("actualKey", actualKey);
    formData.append("quanityType", quanityType);
    formData.append("reasonForUse", reasonForUse);
    formData.append("acceptanceDate", acceptanceDate);
    formData.append("comment", comment);
    formData.append("theme", JSON.stringify(theme));
    try {
      await updateOne(id, formData);
      message.success(`Данные были обновленны`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  }

  console.log(version.comment);

  useEffect(() => {
    setIsLoading(true);
    fetchOneVersion(id).then((data) => {
      setVersion(data);
      setActualKey(data.actualKey);
      setTheme(data.themes);
      setQuanityType(data.quanityType);
      setCount(data.themes.length);
      setReasonForUse(data.reasonForUse);
      setAcceptanceDate(data.acceptanceDate);
      setComment(data.comment);
    });
    setIsLoading(false);
  }, []);

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { theme: "", id: Date.now() }]);
  };

  const removeTheme = (id) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.id !== id));
  };

  const changeTheme = (value, id) => {
    setTheme(theme.map((i) => (i.id === id ? { ...i, ["theme"]: value } : i)));
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
          <Form onFinish={updateVersion}>
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
                        placeholder={updateId}
                        prefix="№"
                        onChange={(value) => setUpdateId(value)}
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
                    >
                      <Select
                        name="selectActualKey"
                        placeholder={`${actualKey}`}
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
                  {
                    theme.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  }
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
                        <Input defaultValue={`${i.title ? i.title : ''}`} />
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
                  >
                    <DatePicker
                      placeholder={version.acceptanceDate}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        setAcceptanceDate(dateString);
                      }}
                    />
                  </Form.Item>

                  <Divider orientation="center">Основание использования</Divider>

                  <Paragraph
                    editable={{
                      onChange: setReasonForUse,
                      maxLength: 500,
                      autoSize: {
                        maxRows: 5,
                        minRows: 4,
                      },
                    }}
                  >
                    {reasonForUse}
                  </Paragraph>

                  <Divider orientation="center">Примечание</Divider>

                  <Paragraph
                    style={{ marginBottom: "20px" }}
                    editable={{
                      onChange: setComment,
                      maxLength: 500,
                      autoSize: {
                        maxRows: 5,
                        minRows: 4,
                      },
                    }}
                  >
                    {comment}
                  </Paragraph>
                 
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
                    title="Удаление версии чек-листа!"
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
      {contextHolder}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  );
});

export default VersionChecklistEdit;
