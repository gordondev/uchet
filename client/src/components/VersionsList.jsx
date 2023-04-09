import React from 'react'
import { Col, Card, Empty } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";

const { Meta } = Card;

const VersionsList = ({ versions }) => {

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
		            actions={[<EditOutlined key="edit" />]}
		            >
		              {
		              	data.actualKey == "Не актуально" ?

		              	<Meta title={"Версия №" + data.id} description={data.actualKey} /> :

			            <>	 
			            	<p className="titleVersion">{"Версия №" + data.id}</p>
			              	<p className="keyActual">Актуально <CheckOutlined /> </p>
			            </>	              	
		              }
		              	
		            </Card>
	              
	        </Col>
        ))
    )
}

export default VersionsList;