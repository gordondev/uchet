import React, { useState, useEffect } from 'react'
import { List, Typography, Button, Collapse, Divider } from 'antd';
import { FileWordOutlined, DownloadOutlined, CheckOutlined } from "@ant-design/icons";
import { useParams } from 'react-router-dom';
import { fetchOneVersion } from "../http/versionChecklistAPI";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const VersionChecklistEdit = () => {
	const [version, setVersion] = useState({themes: [], user: []});
	const {id} = useParams();
	useEffect(() => {
    	fetchOneVersion(id).then(data => setVersion(data))
  	},[])
	return (
		<section className="searchSection">
	        <div className="container">
	        	<div className="defaultForm">
	        		<div className="defaultForm__tile">
	        			
	        		</div>
	        	</div>
	        </div>
        </section>
	)
}

export default VersionChecklistEdit