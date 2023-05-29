import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCountResults } from "../http/chartAPI";
import { Spin, Button } from "antd";
import {
  PrinterOutlined,
} from "@ant-design/icons";

const Chart = () => {
  const [color, setColor] = useState('#0e78ff');
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useMemo(() => (typeof color === 'string' ? color : color.toHexString()), [color]);

  useEffect(() => {
    setIsLoading(true);
    fetchCountResults()
      .then((response) => {
        setData(response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  return (
    <section className="searchSection">
      <div className="container">
        {isLoading ? (
          <div className="spinContainer">
            <Spin size="large" />
          </div>
        ) : (
          <div className="chartForm">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Подразделение" />
                <YAxis />
                <Tooltip contentStyle={{ color: bgColor }} />
                <Legend />
                <Line type="monotone" dataKey="Количество" stroke={bgColor} key={bgColor} />
              </LineChart>
            </ResponsiveContainer>
            <Button
                type="primary"
                style={{ marginTop: "20px" }}
                icon={<PrinterOutlined />}
                onClick={() => {
                  window.print();
                }}
              >
                Печать
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Chart;

