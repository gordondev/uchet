import React, { useEffect, useState, useMemo } from "react";
import { Input, Col, Row, FloatButton, Card, Empty } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";
import { fetchVersionChecklist } from "../http/versionChecklistAPI";

const { Meta } = Card;
const { Search } = Input;

const VersionChecklist = observer(() => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // const [selectedSort, setSelectedSort] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // const sortedVersions = useMemo( () => {
  //   if (selectedSort) {
  //     return [...data].sort((a, b) => a[selectedSort].localeCompare(b[selectedSort]));
  //   }
  // }, [selectedSort, data] );

  const navigate = useNavigate();

  useEffect(() => {
    if (fetching) {
      fetchVersionChecklist(24, currentPage)
        .then((response) => {
          setData([...data, ...response.rows]);
          setCurrentPage((prevState) => prevState + 1);
          setTotalCount(response.count);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  useEffect(() => {
    document.addEventListener("scroll", scrollHendler);
    return () => {
      document.removeEventListener("scroll", scrollHendler);
    };
  }, [totalCount]);

  const scrollHendler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        100 &&
      data.length < totalCount
    ) {
      setFetching(true);
    }
  };

  const sortedAndSearchedVersions = useMemo(() => {
    return data.filter((data) => String(data.id).includes(searchQuery));
  }, [searchQuery, data]);

  return (
    <section className="searchSection">
      <div className="container">
        <Search
          placeholder="Введите версию"
          allowClear
          enterButton="Поиск"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          style={{ width: "100%" }}
        />
          <Row gutter={[40, 16]} justify="left">
          {sortedAndSearchedVersions.length ? sortedAndSearchedVersions.map((data) => (
            <Col className="gutter-row" span={sortedAndSearchedVersions.length == 2 ? 12 : 8}
              key={data.id}>
              {
                data.actualKey == "Не актуально" ?
                  <Card
                  hoverable
                  style={{
                    minWidth: 270,
                    marginTop: 16
                  }}
                  actions={[<EditOutlined key="edit" />]}
                >
                  <Meta title={"Версия №" + data.id} description={data.actualKey} />
                </Card>
                :
                <Card
                hoverable
                style={{
                  minWidth: 270,
                  marginTop: 16,
                  backgroundColor: "#52c41a"
                }}
                actions={[<EditOutlined key="edit" />]}
              >
                <Meta title={"Версия №" + data.id} description={data.actualKey} />
              </Card>
              }
              
            </Col>
          )) : <Empty style={{ marginTop: "20px" }}/>}
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
});

export default VersionChecklist;
