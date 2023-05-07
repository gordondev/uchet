import React, { useState, useEffect, useContext } from "react";

import { Form, Input, Select, Divider, Button, Tabs, Empty, Upload, Typography, message } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { fetchActualThemes, fetchActualChecklists, createResult } from "../http/resultAPI";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Context } from "../index";
import shortid from 'shortid';
import { debounce } from 'lodash';

const fileTypePDF = "application/pdf";
const fileTypeJPG = "image/jpeg";
const fileTypeTIFF = "image/tiff";

const { Title } = Typography;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const ResultCreate = () => {
  const [checklists, setChecklists] = useState([]);
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);
  const [actualThemesTitle, setActualThemesTitle] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [selectedChecklists, setSelectedChecklists] = useState([]);
  const [themes, setThemes] = useState([]);
  const [activeKey, setActiveKey] = useState('1');
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useContext(Context);
  const [dataIsSent, setDataIsSent] = useState(false);
  const [workInProgress, setWorkInProgress] = useState("");
  const [impactOnSave, setImpactOnSave] = useState("");
  const [comment, setComment] = useState("");
  const [finalGrade, setFinalGrade] = useState("");
  const [file, setFile] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchActualThemes().then((data) => setActualThemesTitle(data.map(item => ({
      label: item.title,
      value: item.title,
      id: item.id,
    }))));
    fetchActualChecklists().then((data) => setChecklists(data.map(item => ({
      label: item.name,
      value: item.name,
      disabled: false,
      id: item.id,
    }))) );
    setIsLoading(false);
  }, []);

  const getIdThemeByValue = (value) => {
    const themeObj = actualThemesTitle.find(obj => obj.value === value);
    return themeObj ? themeObj.id : null;
  };

  const themesChange = (value) => {
    setSelectedThemes(value);
    value.forEach(theme => {
      if (!themes.find(obj => obj.theme === theme)) {
        themes.push({ theme: theme, id: getIdThemeByValue(theme), grades: [], points_of_growths: [], strengths: [] });
      }
    });
    setThemes(themes.filter(theme => value.includes(theme.theme)));

    if (value.length === 1) {
      setActiveIndex(0);
      setActiveKey(value[0]);
    } else if (!value.includes(activeKey)) {
      const newActiveIndex = activeIndex >= value.length ? value.length - 1 : activeIndex;
      setActiveIndex(newActiveIndex);
      setActiveKey(value[newActiveIndex]);
    } else {
      setActiveKey(value[activeIndex]);
    }
  };

  const getIdChecklistByValue = (value) => {
    const checklistObj = checklists.find(obj => obj.value === value);
    return checklistObj ? checklistObj.id : null;
  };

  const checklistsChange = (value) => {
    setSelectedChecklists(value);
    value.forEach(checklist => {
      if (!activeTheme.grades.some(({ checklist: c }) => c === checklist)) {
        activeTheme.grades.push({ checklist, grade: '', id: getIdChecklistByValue(checklist) });
      }
    });

    activeTheme.grades = activeTheme.grades.filter(checklist => value.includes(checklist.checklist));
  }; 

  const handleTabChange = (key) => {
    setActiveKey(key);
    setActiveIndex(selectedThemes.indexOf(key));
  };

  const addPoint = () => {
    const newPointsOfGrowth = [...activeTheme.points_of_growths];
    newPointsOfGrowth.push({ point: '', id: shortid.generate() });
    const updatedActiveTheme = { ...activeTheme, points_of_growths: newPointsOfGrowth };
    const updatedThemes = themes.map((theme) => (theme.theme === activeTheme.theme ? updatedActiveTheme : theme));
    setThemes(updatedThemes);
  };

  const activeTheme = themes.find(theme => theme.theme === activeKey);

  const changeGrade = (value, id) => {
    const updatedThemes = themes.map((theme) => {
      if (theme.theme === activeKey) {
        const updatedGrades = theme.grades.map((grade) => {
          if (grade.id === id) {
            return { ...grade, grade: value };
          } else {
            return grade;
          }
        });
        return { ...theme, grades: updatedGrades };
      } else {
        return theme;
      }
    });
    setThemes(updatedThemes);
  };

  const removePoint = (id) => {
    const newPointsOfGrowth = activeTheme.points_of_growths.filter((point) => point.id !== id);
    const updatedActiveTheme = { ...activeTheme, points_of_growths: newPointsOfGrowth };
    const updatedThemes = themes.map((theme) => (theme.theme === activeTheme.theme ? updatedActiveTheme : theme));
    setThemes(updatedThemes);
  };

  const changePoint = debounce((value, id) => {
    const updatedThemes = themes.map((theme) => {
      if (theme.theme === activeKey) {
        const updatedPoint = theme.points_of_growths.map((point) => {
          if (point.id === id) {
            return { ...point, point: value };
          } else {
            return point;
          }
        });
        return { ...theme, points_of_growths: updatedPoint };
      } else {
        return theme;
      }
    });
    setThemes(updatedThemes);
  }, 500);

  const addStrengt = () => {
    const newStrengths = [...activeTheme.strengths];
    newStrengths.push({ strengt: '', id: shortid.generate() });
    const updatedActiveTheme = { ...activeTheme, strengths: newStrengths };
    const updatedThemes = themes.map((theme) => (theme.theme === activeTheme.theme ? updatedActiveTheme : theme));
    setThemes(updatedThemes);
  };

  const removeStrengt = (id) => {
    const newStrengths = activeTheme.strengths.filter((strengt) => strengt.id !== id);
    const updatedActiveTheme = { ...activeTheme, strengths: newStrengths };
    const updatedThemes = themes.map((theme) => (theme.theme === activeTheme.theme ? updatedActiveTheme : theme));
    setThemes(updatedThemes);
  };

  const changeStrengt = debounce((value, id) => {
    const updatedThemes = themes.map((theme) => {
      if (theme.theme === activeKey) {
        const updatedStrengt = theme.strengths.map((strengt) => {
          if (strengt.id === id) {
            return { ...strengt, strengt: value };
          } else {
            return strengt;
          }
        });
        return { ...theme, strengths: updatedStrengt };
      } else {
        return theme;
      }
    });
    setThemes(updatedThemes);
  }, 500);

  const addResult = async () => {
    setDataIsSent(true);
    const formData = new FormData();
    formData.append("userId", user.user.id);
    formData.append("file", file);
    formData.append("finalGrade", finalGrade);
    formData.append("comment", comment);
    formData.append("division", user.user.division);
    formData.append("workInProgress", workInProgress);
    formData.append("impactOnSave", impactOnSave);
    formData.append("themes", JSON.stringify(themes));
    try {
      await createResult(formData);
      message.success(`Результат наблюдения успешно добавлена`);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
    setDataIsSent(false);
  };

  const beforeUploadFile = (file) => {
    const isPDF = file.type ===
      fileTypePDF;

    const isJPG = file.type ===
      fileTypeJPG;

    const isTIFF = file.type ===
      fileTypeTIFF;
      
    if (!isPDF && !isJPG && !isTIFF) {
      message.error("Вы можете загрузить только .pdf .jpg .tiff файл");
    } else {
      setFile(file);
    }
    return !isPDF && !isJPG && !isTIFF;
  };

  const removeFile = () => {
    setFile("");
  };

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
  };

  return (
    <section className="searchSection">
      <div className="container">
        <Form onFinish={addResult}>
          <div className="defaultForm">
            <Title level={4} style={{ marginBottom: "20px" }}>Подразделение: {user.user.division}</Title>
            <div className="defaultForm__tile">
              <Form.Item
                name="title"
                label="Выпоняемая работа"
                style={{ width: "100%", marginRight: "10px" }}
                onChange={debounce((e) => setWorkInProgress(e.target.value), 500)}
                rules={[
                  {
                    required: true,
                    message: "Введите название",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="impactOnSafety"
                label="Влияние на безопасность"
                hasFeedback
                style={{ width: "500px", marginLeft: "10px" }}
                rules={[
                  {
                    required: true,
                    message: "Выберите влияние на безопасность",
                  },
                ]}
              >
                <Select 
                onChange={(value) => {
                  setImpactOnSave(value);
                }}>
                  <Option value="Да">Да</Option>
                  <Option value="Нет">Нет</Option>
                </Select>
              </Form.Item>
            </div>
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Выберите тему"
              onChange={themesChange}
              options={actualThemesTitle}
            />
            {selectedThemes.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <Tabs
              tabPosition="top"
              style={{ marginTop: "20px" }}
              onChange={handleTabChange}
              items={selectedThemes.map((i) => {
                return {
                  label: `${i}`,
                  key: i,
                  children: (
                    <>
                      <Divider orientation="center">Оценки</Divider>
                      <Select
                        allowClear
                        mode="multiple"
                        allowClear
                        style={{
                          width: "100%",
                          marginBottom: "20px"
                        }}
                        placeholder="Выберите чек-лист"
                        onChange={checklistsChange}
                        options={checklists}
                      />

                      {activeTheme.grades.length === 0 && (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}

                      <TransitionGroup>
                      {activeTheme.grades.map(({ checklist, grade, id }, index) => (
                        <CSSTransition key={id} timeout={500} classNames="point">
                        <div className="theme_item">
                          <p style={{ width: "100%" }}>{checklist}</p>
                          <Form.Item
                            key={id}
                            name={id}
                            label="Оценка"
                            hasFeedback
                            style={{ width: "100%", marginTop: "23px" }}
                            rules={[
                              {
                                required: true,
                                message: "Поставьте оценку",
                              },
                            ]}
                          >
                            <Select allowClear onChange={(value) => changeGrade(value, id)}>
                              <Option value="Ниже требований">Ниже требований</Option>
                              <Option value="Соответствуют требованиям">Соответствуют требованиям</Option>
                              <Option value="Выше требований">Выше требований</Option>
                              <Option value="Не наблюдалось">Не наблюдалось</Option>
                            </Select>
                          </Form.Item>
                        </div>
                        </CSSTransition>
                      ))}
                      </TransitionGroup>

                      <Divider orientation="center">Точки роста</Divider>

                      {activeTheme.points_of_growths.length === 0 && (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}

                      <TransitionGroup>
                      {activeTheme.points_of_growths.map(({ point, id }, index) => (
                        <CSSTransition key={point.id} timeout={500} classNames="point">
                        <div className="theme_item">
                          <Form.Item
                            key={id}
                            name={id}
                            label={`Точка роста ${index + 1}`}
                            style={{ width: "100%", marginTop: "23px" }}
                            rules={[
                              {
                                required: true,
                                message: "Введите точку роста",
                              },
                            ]}
                          >
                            <Input showCount maxLength={500} allowClear onChange={e => changePoint(e.target.value, id)}/>
                          </Form.Item>
                          <Button
                            type="primary"
                            danger
                            style={{ marginLeft: "20px" }}
                            icon={<DeleteOutlined />}
                            onClick={() => removePoint(id)}
                          >
                            Удалить
                          </Button>
                        </div>
                        </CSSTransition>
                      ))}
                      </TransitionGroup>
                      <Button
                        type="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        icon={<PlusOutlined />}
                        onClick={addPoint}
                      >
                        Добавить
                      </Button>

                      <Divider orientation="center">Сильные стороны</Divider>

                      {activeTheme.strengths.length === 0 && (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}

                      <TransitionGroup>
                      {activeTheme.strengths.map(({ strengt, id }, index) => (
                        <CSSTransition key={strengt.id} timeout={500} classNames="point">
                        <div className="theme_item">
                          <Form.Item
                            key={id}
                            name={id}
                            label={`Сильная сторона ${index + 1}`}
                            style={{ width: "100%", marginTop: "23px" }}
                            rules={[
                              {
                                required: true,
                                message: "Введите сильную сторону",
                              },
                            ]}
                          >
                            <Input showCount maxLength={500} allowClear onChange={e => changeStrengt(e.target.value, id)}/>
                          </Form.Item>
                          <Button
                            type="primary"
                            danger
                            style={{ marginLeft: "20px" }}
                            icon={<DeleteOutlined />}
                            onClick={() => removeStrengt(id)}
                          >
                            Удалить
                          </Button>
                        </div>
                        </CSSTransition>
                      ))}
                      </TransitionGroup>

                      <Button
                        type="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        icon={<PlusOutlined />}
                        onClick={addStrengt}
                      >
                        Добавить
                      </Button>
                    </>
                  ),
                };
              })}
            />
            <div className="defaultForm__dragBlock">
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
                    Прикрепите файл с отчетом в формате .pdf .tiff .jpg
                  </p>
              </Dragger>
            </div>
            <Form.Item
                name="reasonForUse"
                label="Комментарий"
                style={{ marginTop: "20px"}}
                rules={[
                  {
                    required: true,
                    message: "Напишите комментарий",
                  },
                ]}
              >
                <TextArea
                  allowClear
                  rows={4}
                  onChange={debounce((e) => setComment(e.target.value), 500)}
                  showCount
                  placeholder="Введите комментарий"
                  maxLength={500}
                />
            </Form.Item>
            <Form.Item
              name="finalGrade"
              label="Итоговая оценка"
              hasFeedback
              style={{ width: "100%", marginTop: "20px" }}
              rules={[
                {
                  required: true,
                  message: "Выберите итоговую оценку",
                },
              ]}
            >
              <Select
                onChange={(value) => {
                  setFinalGrade(value);
                }}>>
                <Option value="Ниже требований">Ниже требований</Option>
                <Option value="Соответствуют требованиям">
                  Соответствуют требованиям
                </Option>
                <Option value="Выше требований">Выше требований</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ width: "100%" }}>
              <Button
                type="primary"
                loading={dataIsSent}
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

export default ResultCreate;
