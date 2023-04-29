import React from "react";
import { Input, FloatButton, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { RESULT_CREATE_ROUTE } from "../utils/consts";
import { Collapse } from "antd";

const { Panel } = Collapse;

const { Search } = Input;

const Result = () => {
  const navigate = useNavigate();

  return (
    <section className="searchSection">
      <div className="container">
        <Collapse
          defaultActiveKey={["1"]}
          ghost
          className="collapse__main-filter"
        >
          <Panel header="Фильтры" key="1" style={{ width: "100%" }}>
            <Search
              placeholder="Введите название работы"
              allowClear
              enterButton="Поиск"
              size="default"
              style={{ width: "100%" }}
            />
            <Select
              showSearch
              placeholder="Влияние на безопасность"
              optionFilterProp="children"
              style={{ width: "100%", marginTop: "20px" }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "Да",
                  label: "Да",
                },
                {
                  value: "Нет",
                  label: "Нет",
                },
              ]}
            />
            <Select
              showSearch
              placeholder="Подразделение"
              optionFilterProp="children"
              style={{ width: "100%", marginTop: "20px" }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "ТЦ-3",
                  label: "ТЦ-3",
                },
                {
                  value: "РЦ-2",
                  label: "РЦ-2",
                },
                {
                  value: "РЦ-3",
                  label: "РЦ-3",
                },
                {
                  value: "ЦЦР",
                  label: "ЦЦР",
                },
                {
                  value: "ЦОРО",
                  label: "ЦОРО",
                },
                {
                  value: "ЭЦ",
                  label: "ЭЦ",
                },
                {
                  value: "ЦТАИ",
                  label: "ЦТАИ",
                },
                {
                  value: "ЦВ",
                  label: "ЦВ",
                },
                {
                  value: "ОРБ",
                  label: "ОРБ",
                },
                {
                  value: "ХЦ",
                  label: "ХЦ",
                },
                {
                  value: "ТЦ-2",
                  label: "ТЦ-2",
                },
                {
                  value: "РТЦ-1",
                  label: "РТЦ-1",
                },
                {
                  value: "ЦОС",
                  label: "ЦОС",
                },
                {
                  value: "ОПБ",
                  label: "ОПБ",
                },
                {
                  value: "ОЯБиН",
                  label: "ОЯБиН",
                },
                {
                  value: "Управление",
                  label: "Управление",
                },
                {
                  value: "ОТИиПБ",
                  label: "ОТИиПБ",
                },
                {
                  value: "ОИиКОБ",
                  label: "ОИиКОБ",
                },
                {
                  value: "ООТ",
                  label: "ООТ",
                },
                {
                  value: "УТП",
                  label: "УТП",
                },
              ]}
            />
          </Panel>
        </Collapse>

        <FloatButton.Group
          shape="circle"
          style={{
            right: 24,
          }}
        >
          <FloatButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate(RESULT_CREATE_ROUTE)}
          />
          <FloatButton type="primary" />
        </FloatButton.Group>
      </div>
    </section>
  );
};

export default Result;
