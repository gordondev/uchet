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
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  FileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchOneVersion,
  deleteOne,
  updateOne,
} from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_ROUTE } from "../utils/consts";
import docxImage from "../images/docx.png";
import docImage from "../images/doc.png";
import { getConvertedFileSize } from '../utils/getConvertedFileSize';
import { debounce } from 'lodash';

const fileTypeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fileTypeDoc = "application/msword";

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
  const [headerFileName, setHeaderFileName] = useState("");
  const [headerFileSize, setHeaderFileSize] = useState("");
  const [headerFileExtension, setHeaderFileExtension] = useState("");
  const [commentFileName, setCommentFileName] = useState("");
  const [commentFileSize, setCommentFileSize] = useState("");
  const [commentFileExtension, setCommentFileExtension] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerIsDeleted, setHeaderIsDeleted] = useState("");
  const [commentIsDeleted, setCommentIsDeleted] = useState("");
  const [title, setTitle] = useState("");
  const [dataIsSent, setDataIsSent] = useState(false);
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
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("updateId", updateId);
    formData.append("id", id);
    formData.append("actualKey", actualKey);
    formData.append("quanityType", quanityType);
    formData.append("reasonForUse", reasonForUse);
    formData.append("acceptanceDate", acceptanceDate);
    formData.append("comment", comment);
    formData.append("title", title);
    formData.append("theme", JSON.stringify(theme));
    formData.append("headerFile", headerFile);
    formData.append("commentFile", commentFile);
    formData.append("headerIsDeleted", headerIsDeleted);
    formData.append("commentIsDeleted", commentIsDeleted);
    try {
      await updateOne(id, formData);
      message.success(`Данные были обновленны`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOneVersion(id).then((data) => {
      console.log(data);
      setVersion(data);
      setActualKey(data.actualKey);
      setTheme(data.themes);
      setQuanityType(data.quanityType);
      setCount(data.themes.length);
      setReasonForUse(data.reasonForUse);
      setAcceptanceDate(data.acceptanceDate);
      setComment(data.comment);
      setHeaderFileName(data?.header_files[0]?.fileName);
      setHeaderFileSize(data?.header_files[0]?.fileSize);
      setHeaderFileExtension(data?.header_files[0]?.fileExtension);
      setCommentFileName(data?.comment_files[0]?.fileName);
      setCommentFileSize(data?.comment_files[0]?.fileSize);
      setCommentFileExtension(data?.comment_files[0]?.fileExtension);
      setTitle(data.title);
    });
    setIsLoading(false);
  }, []);

  const addTheme = () => {
    setCount(count + 1);
    setTheme([...theme, { title: "", id: Date.now() }]);
  };

  const removeTheme = (id) => {
    setCount(count - 1);
    setTheme(theme.filter((i) => i.id !== id));
  };

  const changeTheme = debounce((value, id) => {
    setTheme(theme.map((i) => (i.id === id ? { ...i, ["title"]: value } : i)));
  }, 500);

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
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
      setHeaderFileName(file.name);
      setHeaderFileSize(file.size);
      setHeaderFileExtension(file.name.split(".").pop());
      setHeaderIsDeleted("");
    }
    return !isDocx && !isDoc;
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
      setCommentFileName(file.name);
      setCommentFileSize(file.size);
      setCommentFileExtension(file.name.split(".").pop());
      setCommentIsDeleted("");
    }
    return !isDocx && !isDoc;
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
                    <Skeleton.Input
                      active="true"
                      size="small"
                      style={{ marginBottom: "20px" }}
                    />
                    <br />
                    <Skeleton.Input
                      active="true"
                      size="small"
                      style={{ marginBottom: "20px" }}
                    />
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
                        onChange={debounce((value) => setUpdateId(value), 500)}
                        style={{ width: "200px" }}
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
                  <Skeleton.Input
                    active="true"
                    size="small"
                    block={true}
                    style={{ marginBottom: "20px" }}
                  />
                </>
              ) : (
                <>
                  <Form.Item
                    name="title"
                    label="Название версии"
                    onChange={debounce((e) => setTitle(e.target.value), 500)}
                  >
                    <Input allowClear placeholder={title} />
                  </Form.Item>
                </>
              )}

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
                        <Input
                          placeholder={`${i.title ? i.title : ""}`}
                          allowClear
                        />
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
                    <List size="large" bordered>
                      <List.Item>
                        {headerFileName ? (
                          <>
                          <div className="fileElement">
                          {headerFileExtension === "docx" ? (
                            <img src={docxImage} alt="docx" style={{ marginRight: "5px" }}/>
                            ) : (
                              <img src={docImage} alt="docx" style={{ marginRight: "5px" }}/>
                            )
                          }
                            <Text type="secondary">
                              {headerFileName}
                            </Text>
                          </div>

                          <Text type="secondary">
                            {getConvertedFileSize(headerFileSize)}
                          </Text>

                            <Button
                              type="primary"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setHeaderFileName(null);
                                setHeaderFile(null);
                                setHeaderIsDeleted(true);
                              }}
                            >
                              Удалить
                            </Button>
                          </>
                        ) : (
                          <>
                            <Text type="secondary">
                              <FileOutlined /> Прикрепите файл шапки
                            </Text>
                            <Upload
                              {...props}
                              beforeUpload={beforeUploadHeaderFile}
                            >
                              <Button icon={<UploadOutlined />}>
                                Нажмите для загрузки .doc .docx
                              </Button>
                            </Upload>
                          </>
                        )}
                      </List.Item>

                      <List.Item>
                        {commentFileName ? (
                          <>
                          <div className="fileElement">
                          {commentFileExtension === "docx" ? (
                            <img src={docxImage} alt="docx" style={{ marginRight: "5px" }}/>
                            ) : (
                              <img src={docImage} alt="docx" style={{ marginRight: "5px" }}/>
                            )
                          }
                            <Text type="secondary">
                              {commentFileName}
                            </Text>
                          </div>

                          <Text type="secondary">
                            {getConvertedFileSize(commentFileSize)}
                          </Text>

                            <Button
                              type="primary"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                setCommentFileName(null);
                                setCommentFile(null);
                                setCommentIsDeleted(true);
                              }}
                            >
                              Удалить
                            </Button>
                          </>
                        ) : (
                          <>
                            <Text type="secondary">
                              <FileOutlined /> Прикрепите файл комментария
                            </Text>
                            <Upload
                              {...props}
                              beforeUpload={beforeUploadCommentFile}
                            >
                              <Button icon={<UploadOutlined />}>
                                Нажмите для загрузки .doc .docx
                              </Button>
                            </Upload>
                          </>
                        )}
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
                      loading={dataIsSent}
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
