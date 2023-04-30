import React, { useState, useEffect, useContext } from "react";

import { Form, Input, Select, Divider, Button, Tabs, Empty } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { fetchChecklist } from "../http/checklistAPI";
import { fetchActualThemes } from "../http/resultAPI";

const { Option } = Select;

const ResultCreate = () => {
  const [checklists, setChecklists] = useState([]);
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);
  const [actualThemesTitle, setActualThemesTitle] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetchChecklist().then((response) => setChecklists(response.rows));
    fetchVersionChecklist().then((response) => setVersion(response.rows));
    fetchActualThemes().then((data) => setActualThemesTitle(data.map(item => ({
      label: item.title,
      value: item.title
    }))));
    setIsLoading(false);
  }, []);

  console.log(selectedThemes);

  const handleChange = (value) => {
    setSelectedThemes(value);
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
              // defaultValue={["тема 10", "тема 12"]}
              onChange={handleChange}
              options={actualThemesTitle}
            />
            {selectedThemes.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <Tabs
              tabPosition="top"
              style={{ marginTop: "20px" }}
              items={selectedThemes.map((i) => {
                return {
                  label: `${i}`,
                  key: i,
                  children: (
                    <>
                      <Divider orientation="center">Оценки</Divider>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      <Button
                        type="primary"
                        style={{ width: "100%", marginBottom: "20px" }}
                        icon={<PlusOutlined />}
                        // onClick={addTheme}
                      >
                        Добавить
                      </Button>
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
