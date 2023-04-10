import React from 'react'
import { Col, Card, Empty } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { VERSION_CHECKLIST_ROUTE, VERSION_CHECKLIST_EDIT_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const VersionsList = ({ versions }) => {

	const navigate = useNavigate();

	if (!versions.length) {
		return (
			<Empty style={{ marginTop: "20px" }}/>
		)
	}

    return (

        versions.map(( data ) => (

            <Col className="gutter-row" span={versions.length == 2 ? 12 : 8}
	              key={data.id}>
		            <Card
		            hoverable
		            style={{
		            minWidth: 270,
		            marginTop: 16,
		            }}
		            
		            actions={[<EditOutlined key="edit" onClick={() => navigate(VERSION_CHECKLIST_EDIT_ROUTE + "/" + data.id)}/>]}
		            >
		              {
		              	data.actualKey == "Не актуально" ?

		              	<Meta title={"Версия №" + data.id} description={data.actualKey} onClick={() => navigate(VERSION_CHECKLIST_ROUTE + "/" + data.id)}/> :

			            <>
			            	<div onClick={() => navigate(VERSION_CHECKLIST_ROUTE + "/" + data.id)}>
			            		<p className="titleVersion">{"Версия №" + data.id}</p>
			              		<p className="keyActual">Актуально <CheckOutlined /> </p>
			            	</div>	 
			            </>	              	
		              }
		              	
		            </Card>
	              
	        </Col>
        ))
    )
}

export default VersionsList;