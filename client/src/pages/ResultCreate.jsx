import React, { useState, useEffect, useContext } from "react";

import { Form, Input, Select, Divider, Button, Tabs, Empty, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { fetchActualThemes, fetchActualChecklists } from "../http/resultAPI";
import { CSSTransition, TransitionGroup } from 'react-transition-group';


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
    }))));
    setIsLoading(false);
  }, []);

  const themesChange = (value) => {
    setSelectedThemes(value);
    value.forEach(theme => {
      if (!themes.find(obj => obj.theme === theme)) {
        themes.push({ theme: theme, grades: [], points_of_growths: [], strengths: [] });
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

  const findTheme = () => {
    console.log("themes", themes);
    console.log("activeTheme", activeTheme);
    console.log("activeKey", activeKey);
  }

  const checklistsChange = (value) => {
    setSelectedChecklists(value);
    value.forEach(checklist => {
      if (!activeTheme.grades.some(({ checklist: c }) => c === checklist)) {
        activeTheme.grades.push({ checklist, grade: '', id: Date.now() });
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
    newPointsOfGrowth.push({ point: '', id: Date.now() });
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

  return (
    <section className="searchSection">
      <div className="container">
        <Form>
          <div className="defaultForm">
            <div className="defaultForm__tile">
              <Form.Item
                name="title"
                label="Выпоняемая работа"
                style={{ width: "100%", marginRight: "10px" }}
                // onChange={(e) => setName(e.target.value)}
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
                name="select"
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
                <Select>
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
            <Button
                type="primary"
                style={{ width: "100%", marginTop: "20px" }}
                onClick={findTheme}
              >
                TEST
            </Button>
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
                            style={{ width: "100%", margin: "0px 0px 0px 20px" }}
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
                            style={{ width: "100%", margin: "0px 0px 0px 0px" }}
                            rules={[
                              {
                                required: true,
                                message: "Введите точку роста",
                              },
                            ]}
                          >
                            <Input showCount maxLength={500} allowClear />
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
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      <Button
                        type="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        icon={<PlusOutlined />}
                        // onClick={addTheme}
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
                  // {...props}
                  // beforeUpload={beforeUploadCommentFile}
                  // onRemove={removeCommentFile}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Нажмите или перетащите файл в область загрузки
                  </p>
                  <p className="ant-upload-hint">
                    Прикрепите файл с отчетом
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
                  // onChange={(e) => setReasonForUse(e.target.value)}
                  showCount
                  placeholder="Введите комментарий"
                  maxLength={500}
                />
            </Form.Item>
            <Form.Item
              name="select"
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
              <Select>
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
