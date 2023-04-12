import React, { useEffect, useState, useMemo, useRef } from "react";
import { Input, Row, FloatButton, Spin, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import VersionsList from "../components/VersionsList";
import { Collapse } from 'antd';

const { Panel } = Collapse;

const { Search } = Input;

const Checklist = () => {
  const [versionIsLoadind, setVersionIsLoading] = useState(true);
  const currentPage = useRef(1);
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const lastElement = useRef();
  const observer = useRef();

  const navigate = useNavigate();

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
              style={{ width: "100%" }}
            />
            <Select
              showSearch
              placeholder="Версия"
              optionFilterProp="children"
              style={{ width: "100%", marginTop: "20px" }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                {
                  value: 'Да',
                  label: 'Да',
                },
                {
                  value: 'Нет',
                  label: 'Нет',
                },
              ]}
            />
          </Panel>
        </Collapse>
      </div>
    </section>
  );
};

export default Checklist;
