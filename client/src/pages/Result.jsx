import React, { useEffect, useState, useRef, useContext } from "react";
import { Input, Row, FloatButton, Spin, Select, DatePicker, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { RESULT_CREATE_ROUTE } from "../utils/consts";
import { Collapse } from "antd";
import { fetchResult } from "../http/resultAPI";
import Checklists from "../components/Results";
import { observer } from "mobx-react-lite";
import { useObserver } from "../hooks/useObserver";
import Results from "../components/Results";
import ru_RU from 'antd/lib/locale/ru_RU';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Search } = Input;

const Result = observer(() => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchWorkInProgressQuery, setSearchWorkInProgressQuery] = useState("");
  const [searchImpactOnSaveQuery, setSearchImpactOnSaveQuery] = useState("");
  const [searchDivisionQuery, setSearchDivisionQuery] = useState("");
  const [isLoadind, setIsLoading] = useState(true);

  const currentPage = useRef(1);
  const lastElement = useRef();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useObserver(lastElement, data.length < totalCount, isLoadind, () => {
    setIsLoading(true);
    currentPage.current += 1;
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      searchDivisionQuery
    ).then((response) => {
      setData([...data, ...response.rows]);
      setTotalCount(response.count);
    });
    setIsLoading(false);
  });

  useEffect(() => {
    setIsLoading(true);
    currentPage.current = 1;
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      searchDivisionQuery
    ).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });
    setIsLoading(false);
  }, []);

  const searchWorkInProgress = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchWorkInProgressQuery(value);
    fetchResult(
      16,
      currentPage.current,
      value,
      searchImpactOnSaveQuery,
      searchDivisionQuery
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    );
    await sleep(1 * 50);
    setIsLoading(false);
  };

  const searchImpactOnSave = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchImpactOnSaveQuery(value);
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      value,
      searchDivisionQuery
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    );
    await sleep(1 * 50);
    setIsLoading(false);
  };

  const searchDivision = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchDivisionQuery(value);
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      value
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    );
    await sleep(1 * 50);
    setIsLoading(false);
  };

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
              onSearch={(value) => {
                searchWorkInProgress(value);
              }}
            />
            <div style={{ display: "flex" }}>
              <Select
                onChange={(value) => {
                  searchImpactOnSave(value);
                }}
                showSearch
                allowClear
                placeholder="Влияние на безопасность"
                optionFilterProp="children"
                style={{ width: "35%", marginTop: "20px", marginRight: "20px" }}
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
                onChange={(value) => {
                  searchDivision(value);
                }}
                showSearch
                allowClear
                placeholder="Подразделение"
                optionFilterProp="children"
                style={{ width: "35%", marginTop: "20px", marginRight: "20px" }}
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
              <Space direction="vertical" size={12}>
                <RangePicker locale={ru_RU} showTime style={{ width: "100%", marginTop: "20px" }}/>
              </Space>
            </div>
          </Panel>
        </Collapse>

        <Row gutter={[40, 16]} justify="left">
          {isLoadind ? (
            <Spin size="large" style={{ marginTop: "20px" }} />
          ) : (
            <>
              <Results results={data} />
              <div
                ref={lastElement}
                style={{ height: "1px", width: "100%" }}
              ></div>
            </>
          )}
        </Row>

        <FloatButton.Group
          shape="circle"
          style={{
            right: 24,
          }}
        >
          <FloatButton
            tooltip={<div>Создать результат наблюдения</div>}
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate(RESULT_CREATE_ROUTE)}
          />
          <FloatButton type="primary" tooltip={<div>Экспортировать</div>}/>
        </FloatButton.Group>
      </div>
    </section>
  );
});

export default Result;
