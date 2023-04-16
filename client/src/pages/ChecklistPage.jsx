import React, { useState, useEffect } from "react";
import { List, Typography, Button, Divider } from "antd";
import {
  FileWordOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchOneChecklist } from "../http/checklistAPI";

const { Title, Text } = Typography;

const files = [
  <>
    <Text type="secondary">
      {" "}
      <FileWordOutlined /> Файл содержания.docx
    </Text>
    <Button type="primary" icon={<DownloadOutlined />}>
      Скачать
    </Button>
  </>,
];

const ChecklistPage = () => {
  const [checklist, setChecklist] = useState({ contents: [], user: [] });
  const { id } = useParams();

  console.log(checklist);

  useEffect(() => {
    fetchOneChecklist(id).then((data) => setChecklist(data));
  }, []);

  const data = [
    `Автор: ${checklist.user.name + " " + checklist.user.patronymic}`,
    `Дата создания: ${checklist.createdAt}`,
  ];

  const description = [`${checklist.description}`];

  return (
    <section className="searchSection" id="print-section">
      <div className="container">
        <div className="defaultForm">
          <div id="print-section">
            <div className="defaultForm__tile">
              <Title level={3} style={{ color: "#0e78ff" }}>
                {checklist.name}
              </Title>
              <Text type="secondary">
                Версия чек-листа: {checklist.versionChecklistId}
              </Text>
            </div>

            <Divider orientation="center">Информация</Divider>
            <List
              size="large"
              bordered
              dataSource={data}
              style={{ marginBottom: "20px" }}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />

            <Divider orientation="center">Описание</Divider>
            <List
              size="large"
              bordered
              dataSource={description}
              style={{ marginBottom: "20px" }}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />

            <Divider orientation="center">Содержания</Divider>
            <List
              size="large"
              bordered
              dataSource={checklist.checklist_contents}
              style={{ marginBottom: "20px" }}
              renderItem={(item) => <List.Item>{item.content}</List.Item>}
            />
          </div>
          <List
            size="large"
            className="block-file"
            bordered
            dataSource={files}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />

          <Button
            type="primary"
            style={{ width: "100%", marginTop: "20px" }}
            icon={<PrinterOutlined />}
            onClick={() => {
              window.print();
            }}
          >
            Печать
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChecklistPage;
