import { useState } from 'react';

import {
  Typography,
  Form,
  Input,
  Select,
  Divider,
  Button,
  Empty,
  Skeleton,
  message,
  Tabs
} from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const ResultCreate = () => {

	const options = [];
	for (let i = 10; i < 36; i++) {
	  options.push({
	    label: i.toString(36) + i,
	    value: i.toString(36) + i,
	  });
	}

	const handleChange = (value) => {
	  console.log(`selected ${value}`);
	};


	return (
		<section className="searchSection">
        	<div className="container">
        		<Form>
        			<div className="defaultForm">
        				<div className="defaultForm__tile">
        					<Form.Item
			                    name="title"
			                    label="Название темы"
			                    style={{ width: "100%", marginRight: "10px" }}
			                    // onChange={(e) => setName(e.target.value)}
			                    rules={[
			                      {
			                        required: true,
			                        message: "Введите название",
			                      },
			                          ]}
			                  >
			                    <Input />
			                </Form.Item>

			                <Form.Item
			                    name="select"
			                    label="Влияние на безопасность"
			                    hasFeedback
			                    style={{ width: "500px", marginLeft: "10px" }}
			                    rules={[
			                          {
			                            required: true,
			                            message: "Выберите влияние на безопасность",
			                          },
			                        ]}
			                  >
			                    <Select>
				                  <Option value="Да">Да</Option>  
				                  <Option value="Нет">Нет</Option>  
			                    </Select>
			                </Form.Item>
        				</div>
        				<Select
					      mode="multiple"
					      allowClear
					      style={{
					        width: '100%',
					      }}
					      placeholder="Please select"
					      defaultValue={['a10', 'c12']}
					      onChange={handleChange}
					      options={options}
					    />
					    <Tabs
					        tabPosition="top"
					        style={{ marginTop: "20px" }}
					        items={new Array(3).fill(null).map((_, i) => {
					          const id = String(i + 1);
					          return {
					            label: `Tab ${id}`,
					            key: id,
					            children: <h1>eeeee</h1>,
					          };
					        })}
					      />
					    <Form.Item
			                name="select"
			                label="Итоговая оценка"
			                hasFeedback
			                style={{ width: "100%", marginTop: "20px" }}
			                rules={[
			                          {
			                            required: true,
			                            message: "Выберите итоговую оценку",
			                          },
			                      ]}
			                >
			                <Select>
				                <Option value="Ниже требований">Ниже требований</Option>  
				                <Option value="Соответствуют требованиям">Соответствуют требованиям</Option>
				                <Option value="Выше требований">Выше требований</Option>   
			                </Select>
			            </Form.Item>
			            <Form.Item style={{ width: "100%" }}>
		                  <Button
		                    type="primary"
		                    htmlType="submit"
		                    icon={<SaveOutlined />}
		                    style={{ width: "100%" }}
		                  >
		                    Сохранить
		                  </Button>
		              	</Form.Item>
        			</div>
        		</Form>
        	</div>
        </section>
	)
}

export default ResultCreate