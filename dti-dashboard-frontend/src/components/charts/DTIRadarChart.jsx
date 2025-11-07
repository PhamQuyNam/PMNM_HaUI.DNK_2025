// // src/components/charts/DTIRadarChart.jsx
// import React from "react";
// import { Radar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend
// );

// const DTIRadarChart = ({ latestData }) => {
//   // Dữ liệu (4 trụ cột)
//   const data = {
//     labels: ["Chính quyền số", "Kinh tế số", "Xã hội số", "Hạ tầng số"],
//     datasets: [
//       {
//         label: `Phân rã DTI (Năm ${latestData.Nam})`,
//         // Lấy 4 trụ cột từ API (file mockData)
//         data: [
//           latestData.DTI_ChinhQuyenSo,
//           latestData.DTI_KinhTeSo,
//           latestData.DTI_XaHoiSo,
//           latestData.HaTangSo,
//         ],
//         backgroundColor: "rgba(0, 185, 107, 0.2)", // Nền xanh
//         borderColor: "rgba(0, 185, 107, 1)", // Viền xanh
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "top", labels: { color: "#110303ff" } },
//       title: {
//         display: true,
//         text: "Phân rã 4 Trụ cột DTI",
//         color: "#0e0d0dff",
//       },
//     },
//     // Cấu hình trục (scale) của biểu đồ radar
//     scales: {
//       r: {
//         angleLines: { color: "rgba(255, 255, 255, 0.2)" }, // Đường kẻ từ tâm
//         grid: { color: "rgba(255, 255, 255, 0.2)" }, // Lưới tròn
//         pointLabels: { color: "#101010ff" }, // Chữ (Chính quyền số...)
//         ticks: {
//           color: "#000", // Chữ số (0.2, 0.4...)
//           backdropColor: "rgba(188, 174, 174, 0.8)", // Nền trắng cho số
//           backdropPadding: 2,
//         },
//       },
//     },
//   };

//   return <Radar data={data} options={options} style={{ height: "300px" }} />;
// };

// export default DTIRadarChart;
// src/components/charts/DTIRadarChart.jsx
import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const DTIRadarChart = ({ latestData }) => {
  const data = {
    labels: ["Chính quyền số", "Kinh tế số", "Xã hội số", "Hạ tầng số"],
    datasets: [
      {
        label: `Phân rã DTI (Năm ${latestData.Nam})`,
        data: [
          latestData.DTI_ChinhQuyenSo,
          latestData.DTI_KinhTeSo,
          latestData.DTI_XaHoiSo,
          latestData.HaTangSo,
        ],
        backgroundColor: "rgba(0, 185, 107, 0.2)",
        borderColor: "rgba(0, 185, 107, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: {} }, // ĐÃ XÓA color
      title: { display: true, text: "Phân rã 4 Trụ cột DTI" }, // ĐÃ XÓA color
    },
    scales: {
      r: {
        angleLines: { color: "rgba(0, 0, 0, 0.1)" }, // Đổi sang lưới đen mờ
        grid: { color: "rgba(0, 0, 0, 0.1)" }, // Đổi sang lưới đen mờ
        pointLabels: {}, // ĐÃ XÓA color: '#FFF'
        ticks: {
          // (Giữ nguyên tick màu đen)
          backdropColor: "rgba(255, 255, 255, 0.8)",
          backdropPadding: 2,
        },
      },
    },
  };

  return <Radar data={data} options={options} style={{ height: "300px" }} />;
};

export default DTIRadarChart;
