import React, { useEffect, useState, useRef } from "react";
import { Input, Row, FloatButton, Spin, Select, DatePicker, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { RESULT_CREATE_ROUTE } from "../utils/consts";
import { Collapse } from "antd";
import { fetchResult } from "../http/resultAPI";
import { observer } from "mobx-react-lite";
import { useObserver } from "../hooks/useObserver";
import Results from "../components/Results";
import * as XLSX from 'xlsx';

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
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const currentPage = useRef(1);
  const lastElement = useRef();

  const handleExport = async () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Результаты.xlsx");
  }

  useObserver(lastElement, data.length < totalCount, isLoading, () => {
    setIsLoading(true);
    currentPage.current += 1;
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      searchDivisionQuery,
      startDate,
      endDate
    ).then((response) => {
      setData([...data, ...response.rows]);
      setTotalCount(response.count);
    }).finally(() => {
      setIsLoading(false);
    });
  });

  useEffect(() => {
    setIsLoading(true);
    currentPage.current = 1;
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      searchDivisionQuery,
      startDate,
      endDate
    ).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    }).finally(() => {
      setIsLoading(false);
    });
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
      searchDivisionQuery,
      startDate,
      endDate
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
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
      searchDivisionQuery,
      startDate,
      endDate
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
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
      value,
      startDate,
      endDate
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  };

  const handleRangePickerChange = async (dates, dateStrings) => {
    setIsLoading(true);
    currentPage.current = 1;
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
    fetchResult(
      16,
      currentPage.current,
      searchWorkInProgressQuery,
      searchImpactOnSaveQuery,
      searchDivisionQuery,
      dateStrings[0],
      dateStrings[1]
      ).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
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
                <RangePicker showTime style={{ width: "100%", marginTop: "20px" }} onChange={handleRangePickerChange}/>
              </Space>
            </div>
          </Panel>
        </Collapse>

        <Row gutter={[40, 16]} justify="left">
          <Results results={data} isLoading={isLoading} />
          <div ref={lastElement} style={{ height: "1px", width: "100%" }}></div>
        </Row>

        {isLoading ? (
          <Row gutter={[40, 16]} justify="center">
            <Spin size="large" style={{ marginTop: "20px" }} />
          </Row>
        ) : null}


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
          <FloatButton type="primary" tooltip={<div>Экспортировать</div>} onClick={handleExport}/>
        </FloatButton.Group>
      </div>
    </section>
  );
});

export default Result;
