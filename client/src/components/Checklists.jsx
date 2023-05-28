import React from "react";
import { Col, Card, Empty, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { CHECKLIST_ROUTE, CHECKLIST_EDIT_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import checklistImage from "../images/checklist.png";

const Checklists = ({ checklists }) => {
  const navigate = useNavigate();

  if (!checklists.length) {
    return <Empty style={{ marginTop: "20px" }} />;
  }

  return checklists.map((data) => (
    <Col
      className="gutter-row"
      span={checklists.length >= 4 ? 6 : checklists.length === 2 ? 12 : 8}
      key={data.id}
    >
    <Tooltip title={data.theme.title} arrow={false}>
      <Card
        hoverable
        onClick={(event) => {
          if (
            event.target.tagName === "BUTTON" ||
            event.target.tagName === "svg" ||
            event.target.tagName === "path"
          ) {
            navigate(CHECKLIST_EDIT_ROUTE + "/" + data.id);
          } else {
            navigate(CHECKLIST_ROUTE + "/" + data.id);
          }
        }}
        style={{
          minWidth: 300,
          maxWidth: 300,
          marginTop: 16,
        }}
      >
        <div className="item-content">
          <p className="item-id">{data.id}</p>
          <Button
            type="primary"
            htmlType="submit"
            className="btnEdit"
            style={{ width: "40px", height: "40px", borderRadius: "100%" }}
            icon={<EditOutlined />}
          ></Button>
          <img src={checklistImage} alt="checklistImage" />
          <div className="item__title-block">
            <p className="item-title">Версия № {data.theme.versionChecklistId}</p>
            <p className="item-title">{data.theme.title}</p>
          </div>
        </div>
      </Card>
    </Tooltip>
    </Col>
  ));
};

export default Checklists;
