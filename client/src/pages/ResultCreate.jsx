import React, { useState, useEffect, useContext } from "react";

import { Form, Input, Select, Divider, Button, Tabs, Empty, Upload } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { fetchActualThemes, fetchActualChecklists } from "../http/resultAPI";

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
    setActiveKey(value[0]);
    value.forEach(theme => {
      if (!themes.find(obj => obj.theme === theme)) {
        themes.push({ theme: theme, grades: [] });
      }
    });

    setThemes(themes.filter(theme => value.includes(theme.theme)));
  };

  const findTheme = () => {
    console.log("selectedThemes", selectedThemes);
    console.log("themes", themes);
    console.log("activeKey", activeKey);
    console.log("activeTheme", activeTheme);
  }

  const checklistsChange = (value) => {
    value.forEach(checklist => {
      if (!activeTheme.grades.some(({ checklist: c }) => c === checklist)) {
        activeTheme.grades.push({ checklist, grade: 5 });
      }
    });

    activeTheme.grades = activeTheme.grades.filter(checklist => value.includes(checklist.checklist));
  }; 

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const activeTheme = themes.find(theme => theme.theme === activeKey);

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

                      {activeTheme.grades.map(({ checklist }, index) => (
                          <div className="theme_item">
                            
                            <p style={{
                              width: "100%",
                            }}>{checklist}</p>

                            <Form.Item
                              key={index}
                              name={index + 1}
                              label="Оценка"
                              hasFeedback
                              style={{ width: "100%", margin: "0px 0px 0px 20px" }}
                              rules={[
                                {
                                  required: true,
                                  message: "Поствьте оценку",
                                },
                              ]}
                            >
                              <Select>
                                <Option value="Ниже требований">Ниже требований</Option>
                                <Option value="Соответствуют требованиям">Соответствуют требованиям</Option>
                                <Option value="Выше требований">Выше требований</Option>
                              </Select>
                            </Form.Item>
                          </div>
                      ))}


                      <Divider orientation="center">Точки роста</Divider>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      <Button
                        type="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        icon={<PlusOutlined />}
                        // onClick={addTheme}
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
