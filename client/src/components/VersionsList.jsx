import React from "react";
import { Col, Card, Empty, Button, Tooltip } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import {
  VERSION_CHECKLIST_ROUTE,
  VERSION_CHECKLIST_EDIT_ROUTE,
} from "../utils/consts";
import { useNavigate } from "react-router-dom";
import versionImage from "../images/version.png";

const { Meta } = Card;

const VersionsList = ({ versions, isLoading }) => {
  const navigate = useNavigate();

  if (!versions.length && !isLoading) {
    return <Empty style={{ marginTop: "20px" }} />;
  }

  return versions.map((data) => (
    <Col
      className="gutter-row"
      span={versions.length >= 4 ? 6 : versions.length === 2 ? 12 : 8}
      key={data.id}
    >
    <Tooltip title={data.title} arrow={false}>
      <Card
        hoverable
        style={{
          minWidth: 300,
          minWidth: 300,
          marginTop: 16,
        }}
        onClick={(event) => {
          if (
            event.target.tagName === "BUTTON" ||
            event.target.tagName === "svg" ||
            event.target.tagName === "path"
          ) {
            navigate(VERSION_CHECKLIST_EDIT_ROUTE + "/" + data.id);
          } else {
            navigate(VERSION_CHECKLIST_ROUTE + "/" + data.id);
          }
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
          <img src={versionImage} alt="girl" />
          <div className="item__title-block">
            <p className="item-title">Версия № {data.id}</p>
            <p className="item-title">{data.title}</p>
          </div>
          {data.actualKey == "Не актуально" ? (
            <p className="keyNotActual">Не актуально</p>
          ) : (
            <>
              <p className="keyActual">
                Актуально <CheckOutlined />
              </p>
            </>
          )}
        </div>
      </Card>
    </Tooltip>
    </Col>
  ));
};

export default VersionsList;
