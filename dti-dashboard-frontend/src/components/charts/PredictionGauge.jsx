// src/components/charts/PredictionGauge.jsx
import React from "react";
// Import component "Gauge" từ thư viện Ant Design Charts
import { Gauge } from "@ant-design/charts";

const PredictionGauge = ({ predictedDTI }) => {
  // Cấu hình cho đồng hồ đo
  const config = {
    percent: predictedDTI, // Giá trị DTI dự đoán (từ 0 đến 1)
    range: {
      color: ["#cf1322", "#fadb14", "#00b96b"], // Đỏ -> Vàng -> Xanh
      ticks: [0, 0.5, 0.7, 1], // Các mốc chia màu
    },
    indicator: {
      pointer: { style: { stroke: "#D0D0D0" } },
      pin: { style: { stroke: "#D0D0D0" } },
    },
    axis: {
      label: {
        formatter: (v) => Number(v).toFixed(2), // Hiển thị 0.00, 0.50, 1.00
      },
      subTickLine: { count: 3 },
    },
    statistic: {
      title: {
        formatter: ({ percent }) =>
          `DTI Dự đoán: ${(percent * 100).toFixed(2)}%`,
        style: { color: "#FFF", fontSize: "18px" },
      },
      content: {
        formatter: () => (predictedDTI * 100).toFixed(2),
        style: { color: "#FFF", fontSize: "36px", fontWeight: 600 },
      },
    },
  };

  return <Gauge {...config} style={{ height: "250px" }} />;
};

export default PredictionGauge;
