// src/components/charts/ProvincialBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { mockProvincialData } from "../../data/mockData.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// === SỬA: NHẬN "year" TỪ BÊN NGOÀI ===
const ProvincialBarChart = ({ year }) => {
  // Lọc dữ liệu dựa trên "year" được truyền vào
  const dataForYear = mockProvincialData.filter((p) => p.year === year);

  // 1. Chuẩn bị dữ liệu cho Chart.js
  const chartData = {
    labels: dataForYear.map((p) => p.province_name),
    datasets: [
      {
        label: `Chỉ số DTI ${year}`,
        data: dataForYear.map((p) => p.dti),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 2. Cấu hình (Options)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false, // Tắt title ở đây (vì Card đã có title)
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Chỉ số DTI",
        },
      },
    },
  };

  // Thêm key={year} để "ép" biểu đồ render lại khi năm thay đổi
  return <Bar options={options} data={chartData} key={year} />;
};

export default ProvincialBarChart;
