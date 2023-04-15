import React, { useEffect, useState, useMemo, useRef } from "react";
import { Input, Row, FloatButton, Spin, Select, Col, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import VersionsList from "../components/VersionsList";
import { Collapse } from 'antd';
import { fetchChecklist } from "../http/checklistAPI";
import Checklists from "../components/Checklists";

const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;

const Checklist = () => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [checklists, setChecklists] = useState([]);
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);

  const currentPage = useRef(1);
  const lastElement = useRef();
  const observer = useRef();

  const navigate = useNavigate();

  useObserver(lastElement, data.length < totalCount, isLoadind, () => {
    currentPage.current += 1;
    fetchChecklist(24, currentPage.current).then((response) => {
      setData([...data, ...response.rows]);
    });
  });

  useEffect( () => {
    setIsLoading(true);
    fetchChecklist(24, currentPage.current).then((response) => {
      setData([...data, ...response.rows]);
    });
    fetchVersionChecklist().then(response => setVersion(response.rows));
    setIsLoading(false);
  }, []);

  let sortedAndSearchedChecklist = data.filter((data) =>
    String(data.name.toLowerCase()).includes(searchQuery.toLowerCase())
  );

  // console.log(sortedAndSearchedChecklist.filter((i) => i.versionChecklistId === 3));

  const searchChecklist = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className="searchSection">
      <div className="container">
        <Collapse defaultActiveKey={['1']} ghost style={{ width: "100%" }}>
          <Panel header="Фильтры" key="1" style={{ width: "100%" }}>
            <Search
              placeholder="Введите название чек-листа"
              allowClear
              enterButton="Поиск"
              size="default"
              value={searchQuery}
              onChange={searchChecklist}
              style={{ width: "100%" }}
            />
            <Select
              showSearch
              placeholder="Версия"
              style={{ width: "100%", marginTop: "20px" }}
            >
            {
              version.map(item => (
                <Option value={item.id}>{item.id}</Option>    
              ))
            }
            </Select>
          </Panel>
        </Collapse>

        <Row gutter={[40, 16]} justify="left">
          {isLoadind ? (
            <Spin size="large" style={{ marginTop: "20px" }} />
          ) : (
            <>
              <Checklists checklists={sortedAndSearchedChecklist} />
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
          onClick={() => navigate(CHECKLIST_CREATE_ROUTE)}
        />
      </div>
    </section>
  );
};

export default Checklist;
