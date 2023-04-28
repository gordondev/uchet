import React, { useEffect, useState, useRef, useContext } from "react";
import { Input, Row, FloatButton, Spin, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import { Collapse } from "antd";
import { fetchChecklist } from "../http/checklistAPI";
import Checklists from "../components/Checklists";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;

const Checklist = observer(() => {
  const { checklist } = useContext(Context);
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchNameQuery, setSearchNameQuery] = useState("");
  const [searchVersionQuery, setSearchVersionQuery] = useState("");
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);

  const currentPage = useRef(1);
  const lastElement = useRef();

  const navigate = useNavigate();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  useObserver(lastElement, data.length < totalCount, isLoadind, () => {
    setIsLoading(true);
    currentPage.current += 1;
    fetchChecklist(16, currentPage.current, searchVersionQuery, searchNameQuery).then((response) => {
      setData([...data, ...response.rows]);
      setTotalCount(response.count);
    });
    setIsLoading(false);
  });

  useEffect(() => {
    setIsLoading(true);
    currentPage.current = 1;
    fetchChecklist(16, currentPage.current, searchVersionQuery, searchNameQuery).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });
    setIsLoading(false);
  }, []);

  const searchName = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchNameQuery(value);
    fetchChecklist(16, currentPage.current, searchVersionQuery, value).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });
    await sleep(1 * 50);
    setIsLoading(false);
  }

  const searchVersion = async (value) => {
    setIsLoading(true);
    currentPage.current = 1;
    setSearchVersionQuery(value);
    fetchChecklist(16, currentPage.current, value, searchNameQuery).then((response) => {
      setData(response.rows);
      setTotalCount(response.count);
    });
    await sleep(1 * 50);
    setIsLoading(false);
  }


  return (
    <section className="searchSection">
      <div className="container">
        <Collapse defaultActiveKey={["1"]} ghost style={{ width: "100%" }}>
          <Panel header="Фильтры" key="1" style={{ width: "100%" }}>
            <Search
              placeholder="Введите название чек-листа"
              allowClear
              enterButton="Поиск"
              size="default"
              onSearch={(value) => { searchName(value) }}
              style={{ width: "100%" }}
            />
            <Search
              placeholder="Введите версию чек-листа"
              allowClear
              size="default"
              type="number"
              onSearch={(value) => { searchVersion(value) }}
              style={{ width: "100%", marginTop: "20px" }}
            />
          </Panel>
        </Collapse>

        <Row gutter={[40, 16]} justify="left">
          {isLoadind ? (
            <Spin size="large" style={{ marginTop: "20px" }} />
          ) : (
            <>
              <Checklists checklists={data} />
              <div
                ref={lastElement}
                style={{ height: "1px", width: "100%" }}
              ></div>
            </>
          )}
        </Row>
        <FloatButton
          tooltip={<div>Создать чек-лист</div>}
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
});

export default Checklist;
