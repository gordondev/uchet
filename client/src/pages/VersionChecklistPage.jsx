import React, { useState, useEffect } from "react";
import { List, Typography, Button, Collapse, Divider, Skeleton } from "antd";
import {
  FileWordOutlined,
  DownloadOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchOneVersion } from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const files = [
  <>
    <Text type="secondary">
      {" "}
      <FileWordOutlined /> Header.docx
    </Text>
    <Button type="primary" icon={<DownloadOutlined />}>
      Скачать
    </Button>
  </>,
  <>
    <Text type="secondary">
      {" "}
      <FileWordOutlined /> Comment.docx
    </Text>
    <Button type="primary" icon={<DownloadOutlined />}>
      Скачать
    </Button>
  </>,
];

const VersionChecklistPage = observer(() => {
  const [version, setVersion] = useState({ themes: [], user: [] });
  const [loading, setIsLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    setIsLoading(true);
    fetchOneVersion(id).then((data) => setVersion(data));
    setIsLoading(false);
  }, []);

  const data = [
    `Количество типов: ${version.quanityType}`,
    `Дата принятия к руководству: ${version.acceptanceDate}`,
    `Автор: ${version.user.name + " " + version.user.patronymic}`,
    `Дата создания: ${version.createdAt}`,
  ];

  return (
    <section className="searchSection">
      <div className="container">
        <div className="defaultForm">
        {loading ? (
                <>
                  <Skeleton active="true" />
                  <br />
                  <Skeleton active="true" />
                </>
              ) : (
                <>
                  <div className="defaultForm__tile">
                    <Title level={3} style={{ color: "#0e78ff" }}>
                      Версия № {version.id}
                    </Title>
                    {version.actualKey == "Не актуально" ? (
                      <Text type="secondary">
                        Ключ акртуальности: {version.actualKey}
                      </Text>
                    ) : (
                      <div style={{ display: "flex" }}>
                        <Text type="secondary">Ключ акртуальности: </Text>
                        <Text type="success" style={{ paddingLeft: "5px" }}>
                          {" "}
                          {version.actualKey} <CheckOutlined />
                        </Text>
                      </div>
                    )}
                  </div>

                  <Divider orientation="center">Информация</Divider>
                  <List
                    size="large"
                    bordered
                    dataSource={data}
                    style={{ marginBottom: "20px" }}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />

                  <Divider orientation="center">Темы</Divider>
                  <List
                    size="large"
                    bordered
                    dataSource={version.themes}
                    style={{ marginBottom: "20px" }}
                    renderItem={(item) => <List.Item>{item.title}</List.Item>}
                  />

                  <Collapse style={{ marginBottom: "20px" }}>
                    <Panel header="Основание использования" key="1">
                      {version.reasonForUse}
                    </Panel>
                    <Panel header="Примечание" key="2">
                      {version.comment}
                    </Panel>
                  </Collapse>

                  <List
                    size="large"
                    bordered
                    dataSource={files}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </>
        )}
        </div>
        
      </div>
    </section>
  );
});

export default VersionChecklistPage;
