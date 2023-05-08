import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { fetchOneResult } from "../http/resultAPI";
import { useParams } from "react-router-dom";
import { List, Typography, Button, Divider, Skeleton, message, Tabs, Empty } from "antd";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ResultPage = observer(() => {

	const { id } = useParams();
	const [isLoadind, setIsLoading] = useState(true);
	const [themes, setThemes] = useState([]);

	useEffect(() => {
	    setIsLoading(true);
	    fetchOneResult(id).then((data) => {
	      setThemes(data);
	    });
	    setIsLoading(false);
	}, []);

	console.log(themes);

	const data = [
	  `Автор: ${themes?.user?.name + " " + themes?.user?.patronymic}`,
	  `Дата создания: ${new Date(themes?.createdAt).toLocaleString("ru-RU")}`,
	];

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
			                <Title level={3} style={{ color: "#0e78ff" }}>
			                  {themes?.workInProgress}
			                </Title>
			                <Text type="secondary">
			                  Влияние на безопасность: {themes?.impactOnSave}
			                </Text>
			              </div>

			              <Title level={4} style={{ color: "#ff4d4f" }}>
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
				           
			            </>
          			)}
        		</div>
       		</div>
       	</section>
	);

});

export default ResultPage;