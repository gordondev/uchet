import React, { useEffect, useState, useRef } from "react";
import { Input, Row, FloatButton, Spin, Collapse, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import VersionsList from "../components/VersionsList";

const { Search } = Input;
const { Panel } = Collapse;
const { Option } = Select;

const VersionChecklist = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [actualKey, setActualKey] = useState("");

  const currentPage = useRef(1);
  const lastElement = useRef();
  const navigate = useNavigate();

  useObserver(lastElement, data.length < totalCount, isLoading, () => {
    setIsLoading(true);
    currentPage.current += 1;
    fetchVersionChecklist(16, currentPage.current, actualKey, searchQuery).then(
      (response) => {
        setData([...data, ...response.rows]);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  });

  useEffect(() => {
    setIsLoading(true);
    currentPage.current = 1;
    fetchVersionChecklist(16, currentPage.current, actualKey, searchQuery).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const searchData = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchQuery(value);
    fetchVersionChecklist(16, currentPage.current, actualKey, value).then(
      (response) => {
        setData(response.rows);
        setTotalCount(response.count);
      }
    ).finally(() => {
      setIsLoading(false);
    });
  };

  const actulKeyFilter = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setActualKey(value);
    fetchVersionChecklist(16, currentPage.current, value, searchQuery).then(
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
              placeholder="Введите название версии"
              allowClear
              enterButton="Поиск"
              size="default"
              onSearch={(value) => {
                searchData(value);
              }}
              style={{ width: "100%" }}
            />
            <Select
              allowClear
              placeholder="Ключ актуальности"
              style={{ width: "100%", marginTop: "20px" }}
              onChange={(value) => {
                actulKeyFilter(value);
              }}
            >
              <Option value="Актуально">Актуально</Option>
              <Option value="Не актуально">Не актуально</Option>
            </Select>
          </Panel>
        </Collapse>
        
        <Row gutter={[40, 16]} justify="left">
          <VersionsList versions={data} isLoading={isLoading}/>
          <div ref={lastElement} style={{ height: "1px", width: "100%" }}></div>
        </Row>

        {isLoading ? (
          <Row gutter={[40, 16]} justify="center">
            <Spin size="large" style={{ marginTop: "20px" }} />
          </Row>
        ) : null}

        <FloatButton
          tooltip={<div>Создать версию чек-листа</div>}
          icon={<PlusOutlined />}
          type="primary"
          style={{
            right: 20,
          }}
          onClick={() => navigate(VERSION_CHECKLIST_CREATE_ROUTE)}
        />
      </div>
    </section>
  );
};

export default VersionChecklist;
