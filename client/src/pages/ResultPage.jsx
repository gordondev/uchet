import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { fetchOneResult, download, updateResultOfChecking } from "../http/resultAPI";
import { useParams } from "react-router-dom";
import { List, Typography, Button, Divider, Skeleton, message, Tabs, Empty, Form, Select, Input } from "antd";
import {
  SaveOutlined,
  DownloadOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import pdfImage from "../images/pdf.png";
import jpgImage from "../images/jpg.png";
import tiffImage from "../images/tiff.png";
import { debounce } from 'lodash';
import { getConvertedFileSize } from '../utils/getConvertedFileSize';
import { Context } from "../index";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const ResultPage = observer(() => {

	const { id } = useParams();
	const [isLoadind, setIsLoading] = useState(true);
	const [themes, setThemes] = useState([]);
	const [file, setFile] = useState("");
	const [dataIsSent, setDataIsSent] = useState(false);
	const [rejectionСomment, setRejectionСomment] = useState("");
	const [resultOfChecking, setResultOfChecking] = useState("");
	const [showTextArea, setShowTextArea] = useState(false);
	const { user } = useContext(Context);

	useEffect(() => {
	    setIsLoading(true);
	    fetchOneResult(id).then((data) => {
	    	console.log(data);
	      setThemes(data);
	      setFile(data?.observation_results_files[0]?.id);
	    });
	    setIsLoading(false);
	}, [file, dataIsSent]);

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

	const handleSelectChange = (value) => {
	  setResultOfChecking(value);
	  if (value === "Не принято") {
	    setShowTextArea(true);
	  } else {
	    setShowTextArea(false);
	  }
	};

	const updateResultOfCheckingData = async () => {
		setDataIsSent(true);
		const formData = new FormData();
		formData.append("resultOfChecking", resultOfChecking);
		formData.append("rejectionComment", rejectionСomment);
		formData.append("id", id);
		try {
	      await updateResultOfChecking(formData, id);
	    } catch (e) {
	      message.error(e.response?.data?.message);
	    }
		setDataIsSent(false);
	}

	const tabPanes = themes?.themes_results?.map((theme, index) => (
	  <TabPane tab={theme?.theme?.title} key={index}>
	  	<Divider orientation="center">Оценки</Divider>
	   	<List
	        dataSource={theme?.grade_observation_results}
	        renderItem={item => (
	          <List.Item>
	            <div style={{ width: "400px" }}>{item?.checklist_content?.cont}</div>
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
			                <Text type="secondary" style={{ minWidth: "200px" }}>
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
			                  {themes && themes.observation_results_files && themes.observation_results_files.length > 0 ? (
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
				              <Title level={5} style={{ marginRight: "5px" }}>
				                Итоговая оценка: 
				              </Title>
				              <Text style={{ marginTop: "2px" }}>
				              	{themes?.finalGrade} 
				              </Text>
			              </div>

			              {
							  !themes?.resultOfChecking && user.role === "ADMIN" ? (
							    <Form style={{ marginTop: "20px" }} onFinish={updateResultOfCheckingData}>
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
							          onChange={handleSelectChange}
							        >
							          <Option value="Принято">Принято</Option>
							          <Option value="Не принято">Не принято</Option>
							        </Select>
							      </Form.Item>

							      {showTextArea && (
							        <Form.Item
							          label="Комментарий отклонения: "
							          name="comment"
							          rules={[
							            {
							              required: true,
							              message: "Введите комментарий отклонения",
							            },
							          ]}
							        >
							          <TextArea
							            allowClear
							            rows={4}
							            onChange={debounce((e) =>
							              setRejectionСomment(e.target.value)
							            )}
							            showCount
							            placeholder="Введите комментарий отклонения"
							            maxLength={500}
							          />
							        </Form.Item>
							      )}
							      {
							        resultOfChecking &&
							        	<Form.Item style={{ width: "100%" }}>
							                <Button
							                  type="primary"
							                  loading={dataIsSent}
							                  htmlType="submit"
							                  icon={<SaveOutlined />}
							                >
							                  Сохранить
							                </Button>
							            </Form.Item>
							      }
							    </Form>
							  ) : themes?.resultOfChecking === null && user.role === "USER" ? (

							  	<Text>
						        Нет результата
						      </Text>

							  ) : (
							    <>
							      <div style={{ display: "flex" }}>
						              <Text style={{ marginRight: "5px" }}>
						                Результат проверки:  
						              </Text>
						              {
						              	themes?.resultOfChecking === "Не принято" ?
						              	<Text type="danger">
						              		{themes?.resultOfChecking}
						              	</Text> :
						              	<Text type="success">
						              		{themes?.resultOfChecking} <CheckOutlined />
						              	</Text>
						              }
					              </div>
					              {
					              	themes?.resultOfChecking !== "Принято" &&
					              	<div>
						              <Text style={{ marginRight: "5px" }}>
						                Комментарий:  
						              </Text>
						              <br/>
						              <Text type="secondary">
						              	{themes?.rejectionСomment}
						              </Text>
					              	</div>
					              }
							    </>
							  )
							}
			            </>
          			)}
        		</div>
       		</div>
       	</section>
	);

});

export default ResultPage;