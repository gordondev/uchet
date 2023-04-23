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
  const [versionIsLoadind, setVersionIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [actualKey, setActualKey] = useState("");

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const currentPage = useRef(1);
  const lastElement = useRef();

  const navigate = useNavigate();

  useObserver(lastElement, data.length < totalCount, versionIsLoadind, () => {
    setVersionIsLoading(true);
    currentPage.current += 1;
    fetchVersionChecklist(16, currentPage.current, actualKey, searchQuery).then((response) => {
      setData([...data, ...response.rows]);
      setTotalCount(response.count);
    });
    setVersionIsLoading(false);
  });

  useEffect(() => {
    setVersionIsLoading(true);
    currentPage.current = 1;
    fetchVersionChecklist(16, currentPage.current, actualKey, searchQuery).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });

    setVersionIsLoading(false);
  }, [actualKey]);

  const searchData = async (value) => {
    setVersionIsLoading(true);
    currentPage.current = 1;
    setSearchQuery(value);
    fetchVersionChecklist(16, currentPage.current, actualKey, value).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });
    await sleep(1 * 50);
    setVersionIsLoading(false);
  }

  return (
    <section className="searchSection">
      <div className="container">
        <Collapse defaultActiveKey={["1"]} ghost style={{ width: "100%" }}>
          <Panel header="Фильтры" key="1" style={{ width: "100%" }}>
            <Search
              placeholder="Введите название версии"
              allowClear
              enterButton="Поиск"
              size="default"
              onSearch={(value) => { searchData(value) }}
              style={{ width: "100%" }}
            />
            <Select
              allowClear
              placeholder="Ключ актуальности"
              style={{ width: "100%", marginTop: "20px" }}
              onChange={(value) => { setActualKey(value) }}
            >
              <Option value="Актуально">Актуально</Option>
              <Option value="Не актуально">Не актуально</Option>
            </Select>
          </Panel>
        </Collapse>
        <Row gutter={[20, 8]} justify="left">
          {versionIsLoadind ? (
            <Spin size="large" style={{ marginTop: "20px" }} />
          ) : (
            <>
              <VersionsList versions={data} />
              <div
                ref={lastElement}
                style={{ height: "1px", width: "100%" }}
              ></div>
            </>
          )}
        </Row>

        <FloatButton
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
