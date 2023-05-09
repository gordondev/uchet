import React from "react";
import { Col, Card, Empty, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { RESULT_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import resultImage from "../images/result.png";


const Results = ({ results }) => {
  const navigate = useNavigate();

  if (!results.length) {
    return <Empty style={{ marginTop: "20px" }} />;
  }

  return results.map((data) => (
    <Col
      className="gutter-row"
      span={results.length >= 4 ? 6 : results.length === 2 ? 12 : 8}
      key={data.id}
    >
    <Tooltip title={data.workInProgress} arrow={false}>
      <Card
        hoverable
        onClick={(event) => {
          navigate(RESULT_ROUTE + "/" + data.id);
        }}
        style={{
          minWidth: 300,
          maxWidth: 300,
          marginTop: 16,
        }}
      >
        <div className="item-content">
          <p className="item-id">{data.id}</p>
          <img src={resultImage} alt="resultImage" />
          <div className="item__title-block">
            <p className="item-title">{data.division}</p>
            <p className="item-title">{data.workInProgress}</p>
          </div>
        </div>
      </Card>
    </Tooltip>
    </Col>
  ));
};

export default Results;
