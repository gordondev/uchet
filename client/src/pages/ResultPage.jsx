import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { fetchOneResult } from "../http/resultAPI";
import { useParams } from "react-router-dom";

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

	return (
		<section className="searchSection" id="print-section">
      		<div className="container">
        		<div className="defaultForm">
        		</div>
       		</div>
       	</section>
	);

});

export default ResultPage;