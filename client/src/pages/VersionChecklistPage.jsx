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

const VersionChecklistPage = observer(() => {
  const [version, setVersion] = useState({ themes: [], user: [], comment_files: [], header_files: [] });
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
                        Ключ актуальности: {version.actualKey}
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
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  >
                    <List.Item>
                    {
                      version?.header_files[0]?.name ? 
                      <>
                        <Text type="secondary">
                        <FileWordOutlined /> {version?.header_files[0]?.name}
                        </Text>
                        <Button type="primary" icon={<DownloadOutlined />}>
                          Скачать
                        </Button>
                      </> :
                      <>
                        <Text type="secondary">Файл шапки не существует</Text>
                      </>
                    }
                     
                    
                    </List.Item>

                    <List.Item>
                    {
                      version?.comment_files[0]?.name ? 
                      <>
                        <Text type="secondary">
                          <FileWordOutlined /> {version?.comment_files[0]?.name}
                        </Text>
                        <Button type="primary" icon={<DownloadOutlined />}>
                          Скачать
                        </Button>
                      </> :
                      <>
                        <Text type="secondary">Файл комментария не существует</Text>
                      </>
                    }
                    </List.Item>

                  </List>
                </>
        )}
        </div>
        
      </div>
    </section>
  );
});

export default VersionChecklistPage;
