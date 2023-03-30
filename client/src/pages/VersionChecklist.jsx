import React from "react";
import { Input, Col, Row, FloatButton, Card, Skeleton } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { VERSION_CHECKLIST_CREATE_ROUTE } from "../utils/consts";

const { Meta } = Card;
const { Search } = Input;

const VersionChecklist = () => {
  const loading = false;
  const navigate = useNavigate();
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
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={[40, 16]}>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={[40, 16]}>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={[40, 16]}>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={[40, 16]}>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card
              style={{
                minWidth: 270,
                marginTop: 16,
              }}
              actions={[<EditOutlined key="edit" />]}
            >
              <Skeleton loading={loading} active>
                <Meta title="Версия №135002" description="Не актуально" />
              </Skeleton>
            </Card>
          </Col>
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
