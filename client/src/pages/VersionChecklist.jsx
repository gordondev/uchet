import React, { useEffect, useState } from "react";
import { Input, Col, Row, FloatButton, Card} from "antd";
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
  const navigate = useNavigate();

  useEffect( () => {
    if (fetching) {
      console.log('fetching');
      fetchVersionChecklist(24, currentPage).then(response => { 
        setData([...data, ...response.rows]);
        console.log("USE EFFECT", data.length, totalCount);
        setCurrentPage(prevState => prevState + 1);
        setTotalCount(response.count);
      }).finally(() => setFetching(false));
    }
  }, [fetching]);

  useEffect( () => {
    document.addEventListener('scroll', scrollHendler)
    return () => {
      document.removeEventListener('scroll', scrollHendler)
    };

  }, [totalCount]);

  const scrollHendler = (e) => {
    console.log("EVENT SCROLL", data.length, totalCount);
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && data.length <totalCount) {
      setFetching(true);
    }
  }

  return (
    <section className="searchSection">
      <div className="container">
        <Search
          placeholder="Введите версию"
          allowClear
          enterButton="Поиск"
          size="large"
          style={{ width: "100%" }}
        />

        <Row gutter={[40, 16]}>
          {data.map(data =>
            <Col className="gutter-row" span={6} key={data.id}>
              <Card
                style={{
                  minWidth: 270,
                  marginTop: 16,
                }}
                actions={[<EditOutlined key="edit" />]}
              >
                <Meta title={"Версия №" + data.id} description="Не актуально" />
              </Card>
            </Col>
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
});

export default VersionChecklist;
