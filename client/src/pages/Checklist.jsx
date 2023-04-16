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
  const [searchQuery, setSearchQuery] = useState("");
  const [version, setVersion] = useState([]);
  const [isLoadind, setIsLoading] = useState(true);

  const currentPage = useRef(1);
  const lastElement = useRef();

  const navigate = useNavigate();

  useObserver(lastElement, data.length < totalCount, isLoadind, () => {
    currentPage.current += 1;
    fetchChecklist(checklist.selectedVersion, 24, currentPage.current).then((response) => {
      setData([...data, ...response.rows]);
    });
  });

  useEffect(() => {
    setIsLoading(true);
    fetchChecklist(checklist.selectedVersion, 24, currentPage.current).then((response) => {
      setData(response.rows);
    });
    fetchVersionChecklist().then((response) => setVersion(response.rows));
    setIsLoading(false);
  }, [checklist.selectedVersion]);

  let sortedAndSearchedChecklist = data.filter((data) =>
    String(data.name.toLowerCase()).includes(searchQuery.toLowerCase())
  );

  const searchChecklist = (e) => {
    setSearchQuery(e.target.value);
  };

  console.log(checklist.selectedVersion);

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
              value={searchQuery}
              onChange={searchChecklist}
              style={{ width: "100%" }}
            />
            <Select
              showSearch
              placeholder="Версия"
              style={{ width: "100%", marginTop: "20px" }}
              onChange={(value) => { checklist.setSelectedVersion(value) }}
            >
              {version.map((item) => (
                <Option value={item.id}>{item.id}</Option>
              ))}
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
});

export default Checklist;
