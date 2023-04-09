import React from 'react'
import { Col, Card} from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Meta } = Card;

const VersionsList = ({ versions }) => {
    return (
        
        versions.map(( data ) => (

            <Col className="gutter-row" span={versions.length == 2 ? 12 : 8}
	              key={data.id}>
	              {
	                data.actualKey == "Не актуально" ?
	                  <Card
	                  hoverable
	                  style={{
	                    minWidth: 270,
	                    marginTop: 16
	                  }}
	                  actions={[<EditOutlined key="edit" />]}
	                >
	                  <Meta title={"Версия №" + data.id} description={data.actualKey} />
	                </Card>
	                :
	                <Card
	                hoverable
	                style={{
	                  minWidth: 270,
	                  marginTop: 16,
	                  backgroundColor: "#52c41a"
	                }}
	                actions={[<EditOutlined key="edit" />]}
	              >
	                <Meta title={"Версия №" + data.id} description={data.actualKey} />
	              </Card>
	              }
	              
	            </Col>
        ))
    )
}

export default VersionsList;