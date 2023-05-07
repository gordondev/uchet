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
          if (
            event.target.tagName === "BUTTON" ||
            event.target.tagName === "svg" ||
            event.target.tagName === "path"
          ) {
            console.log("click edit");
            // navigate(CHECKLIST_EDIT_ROUTE + "/" + data.id);
          } else {
            navigate(RESULT_ROUTE + "/" + data.id);
          }
        }}
        style={{
          minWidth: 300,
          maxWidth: 300,
          marginTop: 16,
        }}
      >
        <div className="item-content">
          <Button
            type="primary"
            htmlType="submit"
            className="btnEdit"
            style={{ width: "40px", height: "40px", borderRadius: "100%" }}
            icon={<EditOutlined />}
          ></Button>
          <img src={resultImage} alt="resultImage" />
          <div className="item__title-block">
            <p className="item-title">{data.workInProgress}</p>
          </div>
        </div>
      </Card>
    </Tooltip>
    </Col>
  ));
};

export default Results;
