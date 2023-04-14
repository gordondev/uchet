import React from 'react'
import { Col, Card, Empty, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
// import { VERSION_CHECKLIST_ROUTE, VERSION_CHECKLIST_EDIT_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import girl from "../images/welcome.png";

const { Meta } = Card;

const Checklists = ({ checklists }) => {

	const navigate = useNavigate();

	if (!checklists.length) {
		return (
			<Empty style={{ marginTop: "20px" }}/>
		)
	}

    return (

        checklists.map(( data ) => (

            <Col className="gutter-row" span={8} key={data.id}>
		       	<Card
	                hoverable
	                style={{
	                minWidth: 270,
	                marginTop: 16,
	                }} >
	              <div className="checklist__item-content">
	              	<Button
	                  type="primary"
	                  htmlType="submit"
	                  className="btnEdit"
	                  style={{ width: "40px", height: "40px", borderRadius: "100%"}}
	                  icon={<EditOutlined/>}
	                >
	                </Button>
	                <img src={girl} alt="girl"/>
	                <p className="titleChecklist">{data.name}</p>
	              </div>
	              
	            </Card>
	        </Col>
        ))
    )
}

export default Checklists;