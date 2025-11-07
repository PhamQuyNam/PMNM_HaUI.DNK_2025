// // src/components/charts/DVCBarChart.jsx
// import React from "react";
// import { Bar } from "react-chartjs-2"; // Lần này dùng Bar Chart
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// // Đây là 5 chỉ số DVC (Dịch vụ công) theo tài liệu
// const dvcLabels = [
//   "Công khai minh bạch",
//   "Tiến độ giải quyết",
//   "Dịch vụ trực tuyến",
//   "Mức độ hài lòng",
//   "Số hóa hồ sơ",
// ];
// const dvcKeys = [
//   "CongKhaiMinhBach",
//   "TienDoGiaiQuyet",
//   "DichVuTrucTuyen",
//   "MucDoHaiLong",
//   "SoHoaHoSo",
// ];

// const DVCBarChart = ({ latestData }) => {
//   // Lấy dữ liệu 5 cột DVC từ API
//   const chartValues = dvcKeys.map((key) => latestData[key] || 0); // Lấy 0 nếu API (mockData) thiếu

//   const data = {
//     labels: dvcLabels,
//     datasets: [
//       {
//         label: `Điểm Dịch vụ công (Năm ${latestData.Nam})`,
//         data: chartValues,
//         backgroundColor: "rgba(0, 185, 107, 0.5)", // Xanh lục (theme)
//         borderColor: "rgba(0, 185, 107, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     indexAxis: "x", // Biểu đồ cột đứng
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       title: {
//         display: true,
//         text: "Phân rã 5 Chỉ số Dịch vụ công",
//         color: "#080808ff",
//       },
//     },
//     scales: {
//       x: {
//         ticks: { color: "#0a0a0aff" },
//         grid: { display: false },
//       },
//       y: {
//         beginAtZero: true,
//         title: { display: true, text: "Điểm", color: "#0d0b0bff" },
//         ticks: { color: "#000000ff" },
//         grid: { color: "rgba(255, 255, 255, 0.1)" },
//       },
//     },
//   };

//   return <Bar data={data} options={options} style={{ height: "300px" }} />;
// };

// export default DVCBarChart;
// src/components/charts/DVCBarChart.jsx
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const dvcLabels = [
  "Công khai minh bạch",
  "Tiến độ giải quyết",
  "Dịch vụ trực tuyến",
  "Mức độ hài lòng",
  "Số hóa hồ sơ",
];
const dvcKeys = [
  "CongKhaiMinhBach",
  "TienDoGiaiQuyet",
  "DichVuTrucTuyen",
  "MucDoHaiLong",
  "SoHoaHoSo",
];

const DVCBarChart = ({ latestData }) => {
  const chartValues = dvcKeys.map((key) => latestData[key] || 0);

  const data = {
    labels: dvcLabels,
    datasets: [
      {
        label: `Điểm Dịch vụ công (Năm ${latestData.Nam})`,
        data: chartValues,
        backgroundColor: "rgba(0, 185, 107, 0.5)",
        borderColor: "rgba(0, 185, 107, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Phân rã 5 Chỉ số Dịch vụ công" }, // ĐÃ XÓA color
    },
    scales: {
      x: {
        ticks: {}, // ĐÃ XÓA color
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Điểm" }, // ĐÃ XÓA color
        ticks: {}, // ĐÃ XÓA color
        grid: { color: "rgba(0, 0, 0, 0.05)" }, // Đổi sang lưới đen mờ
      },
    },
  };

  return <Bar data={data} options={options} style={{ height: "300px" }} />;
};

export default DVCBarChart;
