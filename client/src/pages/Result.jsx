import React, { useEffect, useState, useMemo, useRef } from "react";
import { Input, Row, FloatButton, Spin, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";
import { useObserver } from "../hooks/useObserver";
import VersionsList from "../components/VersionsList";
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const { Search } = Input;

const Result = () => {
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
            <Select
              showSearch
              placeholder="Подразделение"
              optionFilterProp="children"
              style={{ width: "100%", marginTop: "20px" }}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                {
                  value: 'ТЦ-3',
                  label: 'ТЦ-3',
                },
                {
                  value: 'РЦ-2',
                  label: 'РЦ-2',
                },
                {
                  value: 'РЦ-3',
                  label: 'РЦ-3',
                },
                {
                  value: 'ЦЦР',
                  label: 'ЦЦР',
                },
                {
                  value: 'ЦОРО',
                  label: 'ЦОРО',
                },
                {
                  value: 'ЭЦ',
                  label: 'ЭЦ',
                },
                {
                  value: 'ЦТАИ',
                  label: 'ЦТАИ',
                },
                {
                  value: 'ЦВ',
                  label: 'ЦВ',
                },
                {
                  value: 'ОРБ',
                  label: 'ОРБ',
                },
                {
                  value: 'ХЦ',
                  label: 'ХЦ',
                },
                {
                  value: 'ТЦ-2',
                  label: 'ТЦ-2',
                },
                {
                  value: 'РТЦ-1',
                  label: 'РТЦ-1',
                },
                {
                  value: 'ЦОС',
                  label: 'ЦОС',
                },
                {
                  value: 'ОПБ',
                  label: 'ОПБ',
                },
                {
                  value: 'ОЯБиН',
                  label: 'ОЯБиН',
                },
                {
                  value: 'Управление',
                  label: 'Управление',
                },
                {
                  value: 'ОТИиПБ',
                  label: 'ОТИиПБ',
                },
                {
                  value: 'ОИиКОБ',
                  label: 'ОИиКОБ',
                },
                {
                  value: 'ООТ',
                  label: 'ООТ',
                },
                {
                  value: 'УТП',
                  label: 'УТП',
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
          <FloatButton icon={<PlusOutlined />} type="primary"/>
          <FloatButton type="primary"/>
        </FloatButton.Group>
      </div>
    </section>
  );
};

export default Result;
