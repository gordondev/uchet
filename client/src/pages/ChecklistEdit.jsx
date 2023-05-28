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
import { updateOne, deleteOne, fetchOneChecklist } from "../http/checklistAPI";
import { getThemes } from "../http/versionChecklistAPI";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { CHECKLIST_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import shortid from 'shortid';
import { debounce } from 'lodash';
import docxImage from "../images/docx.png";
import docImage from "../images/doc.png";
import { getConvertedFileSize } from '../utils/getConvertedFileSize';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const fileTypeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const fileTypeDoc = "application/msword";

const { Text } = Typography;
const { TextArea } = Input;

const ChecklistEdit = observer(() => {
  const [isLoadind, setIsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState("");
  const [nameFile, setNameFile] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [fileIsDeleted, setFileIsDeleted] = useState("");
  const [dataIsSent, setDataIsSent] = useState(false);
  const [themeId, setThemeId] = useState();
  const [themes, setThemes] = useState([]);
  const [title, setTitle] = useState("");
  const [versionChecklistId, setVersionChecklistId] = useState();
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchOneChecklist(id).then((data) => {
      setVersionChecklistId(data.versionChecklistId);
      setTitle(data.theme.title);
      setDescription(data.description);
      setContent(data.checklist_contents);
      setNameFile(data?.checklist_files[0]?.fileName);
      setFileExtension(data?.checklist_files[0]?.fileExtension);
      setFileSize(data?.checklist_files[0]?.fileSize);
    });
    getThemes(id).then((data) => {
      const updatedData = data.map((item) => {
        return { ...item, value: item.title };
      });
      setThemes(updatedData);
    });
    setIsLoading(false);
  }, []);

  const addContent = () => {
    setContent([...content, { content: "", id: shortid.generate() }]);
  };

  const removeContent = (id) => {
    setContent(content.filter((i) => i.id !== id));
  };

  const changeContent = debounce((value, id) => {
    setContent(
      content.map((i) => (i.id === id ? { ...i, content: value } : i))
    );
  }, 500);

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
      setNameFile(file.name);
      setFileSize(file.size);
      setFileExtension(file.name.split(".").pop());
      setFileIsDeleted("");
    }
    return !isDocx && !isDoc;
  };

  const updateChecklist = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("themeId", themeId);
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
    setDataIsSent(false);
  };

  const deleteChecklist = async () => {
    try {
      await deleteOne(id);
      navigate(CHECKLIST_ROUTE);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  if (!title) {
    return (
      <section className="searchSection">
        <div className="container">
          <div className="defaultForm">
            <Skeleton active="true" />
            <br />
            <Skeleton active="true" />
          </div>
        </div>
      </section>
      );
  }

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
                    name="select"
                    label="Темы"
                    hasFeedback
                    style={{ width: "100%" }}
                  >
                    <Select
                      allowClear
                      defaultValue={title}
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

                <Divider orientation="center">Описание</Divider>

                <Form.Item
                  label="Описание"
                  name="description"
                >
                  <TextArea
                    allowClear
                    rows={4}
                    onChange={debounce((e) => setDescription(e.target.value), 500)}
                    showCount
                    defaultValue={description}
                    placeholder="Введите описание"
                    maxLength={1000}
                  />
                </Form.Item>

                <Divider orientation="center">Содержания</Divider>
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
                      >
                        <TextArea
                          rows={2}
                          showCount
                          maxLength={1000}
                          defaultValue={`${i.content ? i.content : ""}`}
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

                <List size="large" bordered style={{ marginBottom: "20px" }}>
                  <List.Item>
                    {nameFile ? (
                      <>
                      <div className="fileElement">
                        {fileExtension === "docx" ? (
                          <img src={docxImage} alt="docx" style={{ marginRight: "5px" }}/>
                          ) : (
                            <img src={docImage} alt="doc" style={{ marginRight: "5px" }}/>
                          )
                        }
                        <Text type="secondary">
                          {nameFile}
                        </Text>
                      </div>

                      <Text type="secondary">
                        {getConvertedFileSize(fileSize)}
                      </Text>

                        <Button
                          type="primary"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setNameFile(null);
                            setFile(null);
                            setFileIsDeleted(true);
                          }}
                        >
                          Удалить
                        </Button>
                      </>
                    ) : (
                      <>
                        <Text type="secondary">
                          <FileOutlined /> Прикрепите файл содержания
                        </Text>
                        <Upload {...props} beforeUpload={beforeUploadFile}>
                          <Button icon={<UploadOutlined />}>
                            Нажмите для загрузки .doc .docx
                          </Button>
                        </Upload>
                      </>
                    )}
                  </List.Item>
                </List>
                
                <div className="editButtonsGroup">

                  <Form.Item style={{ marginRight: "10px" }}>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={showModal}
                    >
                      Удалить
                    </Button>
                  </Form.Item>

                  <Form.Item style={{ marginLeft: "10px" }}>
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
