import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { fetchOneResult, download } from "../http/resultAPI";
import { useParams } from "react-router-dom";
import { List, Typography, Button, Divider, Skeleton, message, Tabs, Empty, Form, Select } from "antd";
import { saveAs } from "file-saver";
import {
  FileWordOutlined,
  SaveOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import pdfImage from "../images/pdf.png";
import jpgImage from "../images/jpg.png";
import tiffImage from "../images/tiff.png";

import { getConvertedFileSize } from '../utils/getConvertedFileSize';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ResultPage = observer(() => {

	const { id } = useParams();
	const [isLoadind, setIsLoading] = useState(true);
	const [themes, setThemes] = useState([]);
	const [file, setFile] = useState("");
	const [dataIsSent, setDataIsSent] = useState(false);

	useEffect(() => {
	    setIsLoading(true);
	    fetchOneResult(id).then((data) => {
	      setThemes(data);
	      setFile(data?.observation_results_files[0]?.id);
	    });
	    setIsLoading(false);
	}, []);

	const data = [
	  `Автор: ${themes?.user?.name + " " + themes?.user?.patronymic}`,
	  `Дата создания: ${new Date(themes?.createdAt).toLocaleString("ru-RU")}`,
	];

	const downloadFile = async () => {
	    try {
	      const response = await download(id, file);
	      var FileSaver = require("file-saver");
	      var blob = new Blob([response], {
	        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	      });
	      FileSaver.saveAs(blob, themes?.observation_results_files[0]?.fileName);
	    } catch (e) {
	      message.error(e.response?.data?.message);
	    }
	};

	const tabPanes = themes?.themes_results?.map((theme, index) => (
	  <TabPane tab={theme?.theme?.title} key={index}>
	  	<Divider orientation="center">Оценки</Divider>
	   	<List
	        dataSource={theme?.grade_observation_results}
	        renderItem={item => (
	          <List.Item>
	            <div>{item.checklist.name}</div>
	            <div>{item.grade}</div>
	          </List.Item>
	        )}
      	/>
      	<Divider orientation="center">Точки роста</Divider>
	   	<List
	        dataSource={theme?.points_of_growths}
	        renderItem={item => (
	          <List.Item>
	            <div>{item.point}</div>
	          </List.Item>
	        )}
      	/>
      	<Divider orientation="center">Сильные стороны</Divider>
	   	<List
	        dataSource={theme?.strengths}
	        renderItem={item => (
	          <List.Item>
	            <div>{item.strength}</div>
	          </List.Item>
	        )}
      	/>
	  </TabPane>
	));

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
			                <Title level={4} style={{ color: "#0e78ff" }}>
			                  {themes?.workInProgress}
			                </Title>
			                <Text type="secondary">
			                  Влияние на безопасность: {themes?.impactOnSave}
			                </Text>
			              </div>

			              <Title level={5} style={{ color: "#ff4d4f" }}>
			                Подразделение: {themes?.division}
			              </Title>

			              <Divider orientation="center">Информация</Divider>
			              <List
			                size="large"
			                bordered
			                dataSource={data}
			                style={{ marginBottom: "20px" }}
			                renderItem={(item) => <List.Item>{item}</List.Item>}
			              />

			              {themes?.themes_results?.length === 0 && (
				            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				          )}

			              <Tabs>{tabPanes}</Tabs>
				          
				          <List
				          	style={{ marginTop: "20px" }}
			                size="large"
			                className="block-file"
			                bordered
			              >
			                <List.Item>
			                  {themes?.observation_results_files[0]?.fileName ? (
			                    <>
			                      <div className="fileElement">
			                        {themes?.observation_results_files[0]?.fileExtension === "pdf" ? (
			                            <img src={pdfImage} alt="docx" style={{ marginRight: "5px" }}/>
			                          ) : themes?.observation_results_files[0]?.fileExtension === "jpg" ? (
			                            <img src={jpgImage} alt="jpg" style={{ marginRight: "5px" }}/>
			                          ) : (
			                          	<img src={tiffImage} alt="tiff" style={{ marginRight: "5px" }}/>
			                          )
			                        }
			                        <Text type="secondary">
			                          {themes?.observation_results_files[0]?.fileName}
			                        </Text>
			                      </div>

			                      <Text type="secondary">
			                        {getConvertedFileSize(themes?.observation_results_files[0]?.fileSize)}
			                      </Text>

			                      <Button
			                        type="primary"
			                        icon={<DownloadOutlined />}
			                        onClick={downloadFile}
			                      >
			                        Скачать
			                      </Button>
			                    </>
			                  ) : (
			                    <>
			                      <Text type="secondary">Файл отчета не найден</Text>
			                    </>
			                  )}
			                </List.Item>
			              </List> 

			              <Divider orientation="center">Комментарий</Divider>

			              <List>
			              	<List.Item>
			              		{themes?.comment}
			              	</List.Item>
			              </List>

			              <div style={{ display: "flex", marginTop: "20px" }}>
				              <Text type="danger" style={{ marginRight: "5px" }}>
				                Итоговая оценка: 
				              </Text>
				              <Text>
				              	{themes?.finalGrade} 
				              </Text>
			              </div>

			              <Form style={{ marginTop: "20px" }}>
				              <Form.Item
				                  name="select"
				                  label="Результат проверки"
				                  hasFeedback
				                  style={{ width: "400px" }}
				                  rules={[
				                    {
				                      required: true,
				                      message: "Выберите результат",
				                    },
				                  ]}
				                >
				                  <Select
				                    allowClear
				                    placeholder="Выберите результат"
				                    onChange={(value) => {
				                      // setActualKey(value);
				                    }}
				                  >
				                    <Option value="Актуально">Принято</Option>
				                    <Option value="Не актуально">Не принято</Option>
				                  </Select>
				              </Form.Item>
				              <Form.Item style={{ width: "100%" }}>
				                <Button
				                  type="primary"
				                  loading={dataIsSent}
				                  htmlType="submit"
				                  icon={<SaveOutlined />}
				                  style={{ width: "100%" }}
				                >
				                  Сохранить
				                </Button>
				              </Form.Item>
			              </Form>
			            </>
          			)}
        		</div>
       		</div>
       	</section>
	);

});

export default ResultPage;