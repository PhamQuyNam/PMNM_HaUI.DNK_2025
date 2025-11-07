import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Button, Space } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const buildDatasets = (provinceData, view) => {
  const years = provinceData.map((d) => d.Nam);

  switch (view) {
    case "DTI_PILLARS":
      return {
        labels: years,
        datasets: [
          {
            label: "Chính quyền số",
            data: provinceData.map((d) => d.DTI_ChinhQuyenSo),
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
          {
            label: "Kinh tế số",
            data: provinceData.map((d) => d.DTI_KinhTeSo),
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
          {
            label: "Xã hội số",
            data: provinceData.map((d) => d.DTI_XaHoiSo),
            borderColor: "rgb(255, 206, 86)",
            tension: 0.1,
          },
          {
            label: "Hạ tầng số",
            data: provinceData.map((d) => d.HaTangSo),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      };
    case "ECON_DVC":
      return {
        labels: years,
        datasets: [
          {
            label: "GRDP/người",
            data: provinceData.map((d) => d.GRDP_BinhQuan),
            borderColor: "rgb(153, 102, 255)",
            tension: 0.1,
          },
          {
            label: "Đô thị hóa (%)",
            data: provinceData.map((d) => d.TyLeThanhThi),
            borderColor: "rgb(255, 159, 64)",
            tension: 0.1,
          },
          {
            label: "Điểm Dịch vụ công", // <-- SỬA 1: Sửa tên
            data: provinceData.map((d) => d.TongDiem_DVC), // <-- SỬA 2: Sửa nguồn data
            borderColor: "rgb(75, 192, 192)", // <-- SỬA 3: Đổi sang màu (ví dụ: Teal)
            tension: 0.1,
          },
        ],
      };
    case "DTI_GENERAL":
    default:
      return {
        labels: years,
        datasets: [
          {
            label: "DTI Tổng",
            data: provinceData.map((d) => d.DTI_Tong),
            borderColor: "rgb(0, 185, 107)",
            tension: 0.1,
          },
        ],
      };
  }
};

const TrendLineChart = ({ provinceData }) => {
  const [view, setView] = useState("DTI_GENERAL");
  const chartData = buildDatasets(provinceData, view);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: {} }, // ĐÃ XÓA color
      title: { display: true, text: `Xu hướng 3 năm` }, // ĐÃ XÓA color
    },
    scales: {
      x: { ticks: {}, grid: { color: "rgba(0, 0, 0, 0.05)" } }, // ĐÃ XÓA color
      y: { ticks: {}, grid: { color: "rgba(0, 0, 0, 0.05)" } }, // ĐÃ XÓA color
    },
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type={view === "DTI_GENERAL" ? "primary" : "default"}
          onClick={() => setView("DTI_GENERAL")}
        >
          DTI (Chung)
        </Button>
        <Button
          type={view === "DTI_PILLARS" ? "primary" : "default"}
          onClick={() => setView("DTI_PILLARS")}
        >
          Trụ cột DTI
        </Button>
        <Button
          type={view === "ECON_DVC" ? "primary" : "default"}
          onClick={() => setView("ECON_DVC")}
        >
          Kinh tế & DVC
        </Button>
      </Space>

      <div style={{ height: "300px" }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default TrendLineChart;
