import React, { useState, useEffect } from "react";
import {
  List,
  Typography,
  Button,
  Collapse,
  Divider,
  Skeleton,
  message,
} from "antd";
import {
  FileWordOutlined,
  DownloadOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import {
  fetchOneVersion,
  downloadHeaderFile,
  downloadCommentFile,
} from "../http/versionChecklistAPI";
import { observer } from "mobx-react-lite";
import { saveAs } from "file-saver";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const VersionChecklistPage = observer(() => {
  const [version, setVersion] = useState({
    themes: [],
    user: [],
    comment_files: [],
    header_files: [],
  });
  const [loading, setIsLoading] = useState(true);
  const [headerFile, setHeaderFile] = useState("");
  const [commentFile, setCommentFile] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchOneVersion(id).then((data) => {
      setHeaderFile(data?.header_files[0]?.id);
      setCommentFile(data?.comment_files[0]?.id);
      setVersion(data);
    });
    setIsLoading(false);
  }, [commentFile, headerFile]);

  const data = [
    `Количество типов: ${version.quanityType}`,
    `Дата принятия к руководству: ${new Date(
      version.acceptanceDate
    ).toLocaleString("ru-RU", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    `Автор: ${version.user.name + " " + version.user.patronymic}`,
    `Дата создания: ${new Date(version?.createdAt).toLocaleString("ru-RU")}`,
  ];

  const downloadHeader = async () => {
    try {
      const response = await downloadHeaderFile(id, headerFile);
      var FileSaver = require("file-saver");
      var blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      FileSaver.saveAs(blob, version?.header_files[0]?.name);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

  const downloadComment = async () => {
    try {
      const response = await downloadCommentFile(id, commentFile);
      var FileSaver = require("file-saver");
      var blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      FileSaver.saveAs(blob, version?.comment_files[0]?.name);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

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
                  {version?.header_files[0]?.name ? (
                    <>
                      <Text type="secondary">
                        <FileWordOutlined /> {version?.header_files[0]?.name}
                      </Text>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={downloadHeader}
                      >
                        Скачать
                      </Button>
                    </>
                  ) : (
                    <>
                      <Text type="secondary">Файл шапки не найден</Text>
                    </>
                  )}
                </List.Item>

                <List.Item>
                  {version?.comment_files[0]?.name ? (
                    <>
                      <Text type="secondary">
                        <FileWordOutlined /> {version?.comment_files[0]?.name}
                      </Text>
                      <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={downloadComment}
                      >
                        Скачать
                      </Button>
                    </>
                  ) : (
                    <>
                      <Text type="secondary">Файл комментария не найден</Text>
                    </>
                  )}
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
