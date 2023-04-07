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
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    fetchVersionChecklist().then(response => setData(response))
  }, []);

  console.log(data);
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
            <Col className="gutter-row" span={6}>
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
