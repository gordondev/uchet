import React from "react";
import { Input } from "antd";
import { Col, Row } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Avatar, Card, Skeleton, Switch } from "antd";
const { Meta } = Card;

const { Search } = Input;

const VersionChecklist = () => {
  const loading = false;
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
        />
      </div>
    </section>
  );
};

export default VersionChecklist;
