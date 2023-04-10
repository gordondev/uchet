import React, { useEffect, useState, useMemo, useRef } from "react";
import { Input, Row, FloatButton, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import VersionsList from "../components/VersionsList";

const { Search } = Input;

const VersionChecklist = () => {
  const [versionIsLoadind, setVersionIsLoading] = useState(true);
  const currentPage = useRef(1);
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const lastElement = useRef();
  const observer = useRef();  
  
  const navigate = useNavigate();

  useObserver(lastElement, data.length < totalCount, versionIsLoadind, () => {
    currentPage.current += 1;
    fetchVersionChecklist(24, currentPage.current).then((response) => {
      setData([...data, ...response.rows]);
    });
  })

  useEffect(() => {
    setVersionIsLoading(true);
    fetchVersionChecklist(24, currentPage.current).then((response) => {
      setData([...data, ...response.rows]);
      setTotalCount(response.count);
    });

    setVersionIsLoading(false);
  }, []);

  let sortedAndSearchedVersions = data.filter((data) => String(data.id).includes(searchQuery));

  const searchVersion = (e) => {
    setSearchQuery(e.target.value);
  }

  return (
    <section className="searchSection">
      <div className="container">
        <Search
          placeholder="Введите версию"
          allowClear
          enterButton="Поиск"
          value={searchQuery}
          onChange={searchVersion}
          size="large"
          style={{ width: "100%" }}
        />
        <Row gutter={[40, 16]} justify="left">
          {
            versionIsLoadind ? <Spin size="large" style={{marginTop: "20px"}}/> : 
            <>
              <VersionsList versions={sortedAndSearchedVersions}/>
              <div ref={lastElement} style={{ height: "1px", width: "100%" }}></div>
            </>
          }
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
