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
  Empty,
  List,
  Upload,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined, FileWordOutlined, UploadOutlined  } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOneVersion,
  deleteOne,
  updateOne,
} from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_ROUTE } from "../utils/consts";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

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
  const [headerFileName, setHeaderFileName] = useState('');
  const [commentFileName, setCommentFileName] = useState('');
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
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  const updateVersion = async () => {
    const formData = new FormData();
    console.log(theme);
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
  };

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
      setHeaderFileName(data?.header_files[0]?.name);
      setCommentFileName(data?.comment_files[0]?.name);
    });
    setIsLoading(false);
  }, [headerFile, commentFile]);

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { title: "", id: Date.now() }]);
  };

  const removeTheme = (id) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.id !== id));
  };

  const changeTheme = (value, id) => {
    setTheme(theme.map((i) => (i.id === id ? { ...i, ["title"]: value } : i)));
  };

  const props = {
    name: 'file',
    multiple: false,
    maxCount: 1,
  }

  const beforeUploadHeaderFile = (file) => {
      const isDocx = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isDocx) {
        message.error('Вы можете загрузить только .docx файл');
      } else {
        setHeaderFile(file);
      }
      return false;
  };

  const removeHeaderFile = () => {
    setHeaderFile('');
  }

  return (
    <ReachableContext.Provider value="Light">
      <section className="searchSection">
        <div className="container">
          <Form onFinish={updateVersion}>
            <div className="defaultForm">
              <div className="defaultForm__tile">
                {loading ? (
                  <>
                    <Skeleton.Input active="true" size="400" style={{ marginBottom: "20px" }}/>
                    <br />
                    <Skeleton.Input active="true" size="400" style={{ marginBottom: "20px" }}/>
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
                  {theme.length === 0 && (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                  {theme.map((i) => (
                    <div className="theme_item">
                      <Form.Item
                        name={i.id}
                        label="Название темы"
                        placeholder="Error"
                        style={{ marginTop: "23px", width: "100%" }}
                        onChange={(e) => changeTheme(e.target.value, i.id)}
                      >
                        <Input defaultValue={`${i.title ? i.title : ""}`} />
                      </Form.Item>
                      <Button
                        type="primary"
                        danger
                        style={{ marginLeft: "20px" }}
                        icon={<DeleteOutlined />}
                        onClick={() => removeTheme(i.id)}
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
                    <List
                      size="large"
                      bordered
                    >
                      <List.Item>
                      { headerFileName ?
                        <>
                          <Text type="secondary">
                          <FileWordOutlined /> {headerFileName}
                          </Text>
                          <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setHeaderFileName(null)}
                          >
                            Удалить
                          </Button>
                        </> :
                        <>
                          <Text type="secondary">
                          <FileWordOutlined /> Файл шапки не найден
                          </Text>
                          <Upload {...props} beforeUpload={beforeUploadHeaderFile}>
                            <Button icon={<UploadOutlined />}>Нажмите для загрузки .doc .docx</Button>
                          </Upload>
                        </>
                      }
                        
                      
                      </List.Item>

                      <List.Item>
                      { commentFileName ?
                        <>
                          <Text type="secondary">
                          <FileWordOutlined /> {commentFileName}
                          </Text>
                          <Button
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setCommentFileName(null)}
                          >
                            Удалить
                          </Button>
                        </> :
                        <>
                          <Text type="secondary">
                          <FileWordOutlined /> Файл комментария не найден
                          </Text>
                          <Upload>
                            <Button icon={<UploadOutlined />}>Нажмите для загрузки .doc .docx</Button>
                          </Upload>
                        </>
                      }
                        
                      
                      </List.Item>

                    </List>
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
                  <Form.Item label="Дата принятия" name="date-picker">
                    <DatePicker
                      placeholder={version.acceptanceDate}
                      style={{ width: "100%" }}
                      onChange={(date, dateString) => {
                        setAcceptanceDate(dateString);
                      }}
                    />
                  </Form.Item>

                  <Divider orientation="center">
                    Основание использования
                  </Divider>

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
