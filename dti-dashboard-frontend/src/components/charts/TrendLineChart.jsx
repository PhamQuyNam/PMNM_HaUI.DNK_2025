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

// HÀM 1: buildDatasets (Đã sửa lỗi DTI và DVC)
const buildDatasets = (provinceData, view) => {
  const years = provinceData.map((d) => d.Nam);

  switch (view) {
    case "DTI_PILLARS":
      return {
        labels: years,
        datasets: [
          // ... (code 4 trụ cột DTI)
          {
            label: "Chính quyền số",
            data: provinceData.map((d) => d.DTI_ChinhQuyenSo * 100),
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
          {
            label: "Kinh tế số",
            data: provinceData.map((d) => d.DTI_KinhTeSo * 100),
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
          {
            label: "Xã hội số",
            data: provinceData.map((d) => d.DTI_XaHoiSo * 100),
            borderColor: "rgb(255, 206, 86)",
            tension: 0.1,
          },
          {
            label: "Hạ tầng số",
            data: provinceData.map((d) => d.HaTangSo * 100),
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
            label: "GRDP/người (Triệu)",
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
            label: "Điểm Dịch vụ công (Điểm)", // <-- ĐÃ SỬA TÊN
            data: provinceData.map((d) => d.TongDiem_DVC), // <-- ĐÃ SỬA DATA
            borderColor: "rgb(75, 192, 192)",
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
            data: provinceData.map((d) => d.DTI_Tong * 100), // <-- ĐÃ NHÂN 100
            borderColor: "rgb(0, 185, 107)",
            tension: 0.1,
          },
        ],
      };
  }
};

// HÀM 2: COMPONENT CHÍNH
const TrendLineChart = ({ provinceData }) => {
  const [view, setView] = useState("DTI_GENERAL");

  // (Phải gọi buildDatasets BÊN TRONG component)
  const chartData = buildDatasets(provinceData, view);

  // (Phải đặt options BÊN TRONG component để dùng 'view')
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: {} },
      title: { display: true, text: `Xu hướng 3 năm` },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            let value = context.parsed.y.toFixed(2);
            if (
              context.dataset.label.includes("DTI Tổng") ||
              context.dataset.label.includes("Đô thị hóa") ||
              context.dataset.label.includes("Chính quyền số") || // <-- Thêm
              context.dataset.label.includes("Kinh tế số") || // <-- Thêm
              context.dataset.label.includes("Xã hội số") || // <-- Thêm
              context.dataset.label.includes("Hạ tầng số") // <-- Thêm
            ) {
              label += value + "%";
            } else {
              label += value;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: { ticks: {}, grid: { color: "rgba(0, 0, 0, 0.05)" } },
      y: {
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  // (Phải đặt return BÊN TRONG component)
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
}; // <-- DẤU NGOẶC KẾT THÚC CỦA COMPONENT

export default TrendLineChart;
