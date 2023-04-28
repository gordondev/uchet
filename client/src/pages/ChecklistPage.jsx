import React, { useState, useEffect } from "react";
import { List, Typography, Button, Divider, Skeleton, message } from "antd";
import {
  FileWordOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { fetchOneChecklist, download } from "../http/checklistAPI";
import { observer } from "mobx-react-lite";
import { saveAs } from 'file-saver';

const { Title, Text } = Typography;

const ChecklistPage = observer(() => {
  const [checklist, setChecklist] = useState({ contents: [], user: [], checklist_files: [] });
  const [isLoadind, setIsLoading] = useState(true);
  const [file, setFile] = useState('');
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    fetchOneChecklist(id).then((data) => {
      setChecklist(data);
      setFile(data?.checklist_files[0]?.id);
    });
    setIsLoading(false);
  }, [file]);

  console.log(checklist);

  const data = [
    `Автор: ${checklist.user.name + " " + checklist.user.patronymic}`,
    `Дата создания: ${new Date(checklist?.createdAt).toLocaleString('ru-RU')}`,
  ];

  const downloadFile = async () => {
    try {
      const response = await download(id, file);
      var FileSaver = require('file-saver');
      var blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
      FileSaver.saveAs(blob, checklist?.checklist_files[0]?.name);
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  }

  return (
    <section className="searchSection" id="print-section">
      <div className="container">
        <div className="defaultForm">
        {isLoadind ? (
                  <>
                    <Skeleton active="true" />
                    <br />
                    <Skeleton active="true" />
                  </>
                ) : (
                  <>
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
                      style={{ marginBottom: "20px" }}
                      renderItem={(item) => <List.Item>{item}</List.Item>}
                    >
                      <List.Item>
                        <Text>
                          {checklist.description}
                        </Text>
                      </List.Item>
                    </List>

                    <Divider orientation="center">Содержания</Divider>
                    <List
                      size="large"
                      bordered
                      dataSource={checklist.checklist_contents}
                      style={{ marginBottom: "20px" }}
                      renderItem={(item) => <List.Item>{item.content}</List.Item>}
                    />
                  <List
                    size="large"
                    className="block-file"
                    bordered
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  >
                    <List.Item>
                      {
                        checklist?.checklist_files[0]?.name ? 
                        <>
                          <Text type="secondary">
                            <FileWordOutlined /> {checklist?.checklist_files[0]?.name}
                          </Text>
                          <Button type="primary" icon={<DownloadOutlined />} onClick={downloadFile}>
                            Скачать
                          </Button>
                        </> :
                        <>
                          <Text type="secondary">Файл содержания не найден</Text>
                        </>
                      }
                    </List.Item>
                  </List>

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
                </>
          )}
        </div>
      </div>
    </section>
  );
});

export default ChecklistPage;
