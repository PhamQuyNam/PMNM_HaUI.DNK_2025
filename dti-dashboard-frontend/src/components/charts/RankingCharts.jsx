// // src/components/charts/RankingCharts.jsx
// import React, { useMemo } from "react";
// import { Bar } from "react-chartjs-2";
// import { Row, Col } from "antd";
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

// // TẠO 1 COMPONENT BIỂU ĐỒ NGANG TÁI SỬ DỤNG
// const HorizontalBarChart = ({ chartData, title, color }) => {
//   const options = {
//     indexAxis: "y", // <-- Đây là "ma thuật" biến nó thành biểu đồ ngang
//     responsive: true,
//     maintainAspectRatio: false, // Cho phép co giãn (quan trọng)
//     plugins: {
//       legend: { display: false }, // Ẩn chú thích
//       title: { display: true, text: title, color: "#070707ff" }, // Chữ màu trắng
//     },
//     scales: {
//       x: {
//         beginAtZero: true,
//         title: { display: true, text: "Chỉ số DTI", color: "#000000ff" },
//         ticks: { color: "#090000ff" }, // Chữ trục x màu trắng
//         grid: { color: "rgba(255, 255, 255, 0.1)" }, // Lưới mờ
//       },
//       y: {
//         ticks: { color: "#080808ff" }, // Chữ trục y màu trắng
//         grid: { display: false }, // Ẩn lưới y
//       },
//     },
//   };

//   // Cập nhật màu sắc cho dữ liệu
//   const updatedChartData = {
//     ...chartData,
//     datasets: chartData.datasets.map((ds) => ({
//       ...ds,
//       backgroundColor: `rgba(${color}, 0.5)`,
//       borderColor: `rgba(${color}, 1)`,
//       borderWidth: 1,
//     })),
//   };

//   return (
//     <Bar
//       options={options}
//       data={updatedChartData}
//       style={{ height: "300px" }}
//     />
//   );
// };

// // COMPONENT CHÍNH
// const RankingCharts = ({ data }) => {
//   // 1. Dùng useMemo để tính toán Top/Bottom 10 (chỉ khi data thay đổi)
//   const { top10, bottom10 } = useMemo(() => {
//     // Sắp xếp dữ liệu từ thấp đến cao theo DTI_Tong
//     const sortedData = [...data].sort((a, b) => a.DTI_Tong - b.DTI_Tong);

//     // Lấy 10 thằng cuối (cao nhất) và đảo ngược lại (để thằng cao nhất ở trên)
//     const top = sortedData.slice(-10).reverse();
//     // Lấy 10 thằng đầu (thấp nhất)
//     const bottom = sortedData.slice(0, 10);

//     return { top10: top, bottom10: bottom };
//   }, [data]);

//   // 2. Định dạng dữ liệu cho "Top 10"
//   const top10ChartData = {
//     labels: top10.map((p) => p.TinhThanh),
//     datasets: [
//       {
//         label: "DTI",
//         data: top10.map((p) => p.DTI_Tong),
//       },
//     ],
//   };

//   // 3. Định dạng dữ liệu cho "Bottom 10"
//   const bottom10ChartData = {
//     labels: bottom10.map((p) => p.TinhThanh),
//     datasets: [
//       {
//         label: "DTI",
//         data: bottom10.map((p) => p.DTI_Tong),
//       },
//     ],
//   };

//   return (
//     <Row gutter={16}>
//       <Col span={12}>
//         <HorizontalBarChart
//           chartData={top10ChartData}
//           title="Top 10 DTI Cao nhất"
//           color="0, 185, 107"
//         />
//       </Col>
//       <Col span={12}>
//         <HorizontalBarChart
//           chartData={bottom10ChartData}
//           title="Top 10 DTI Thấp nhất"
//           color="255, 99, 132"
//         />
//       </Col>
//     </Row>
//   );
// };

// export default RankingCharts;
// src/components/charts/RankingCharts.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Row, Col } from "antd";
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

const HorizontalBarChart = ({ chartData, title, color }) => {
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: "Chỉ số DTI (%)" },
        ticks: {},
        grid: { color: "rgba(0, 0, 0, 0.05)" }, // Đổi sang lưới đen mờ
      },
      y: {
        ticks: {},
        grid: { display: false },
      },
    },
  };

  const updatedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((ds) => ({
      ...ds,
      backgroundColor: `rgba(${color}, 0.5)`,
      borderColor: `rgba(${color}, 1)`,
      borderWidth: 1,
    })),
  };

  return (
    <Bar
      options={options}
      data={updatedChartData}
      style={{ height: "300px" }}
    />
  );
};

const RankingCharts = ({ data }) => {
  const { top10, bottom10 } = useMemo(() => {
    const sortedData = [...data].sort((a, b) => a.DTI_Tong - b.DTI_Tong);
    const top = sortedData.slice(-10).reverse();
    const bottom = sortedData.slice(0, 10);
    return { top10: top, bottom10: bottom };
  }, [data]);

  const top10ChartData = {
    labels: top10.map((p) => p.TinhThanh),
    datasets: [
      {
        label: "DTI",
        data: top10.map((p) => p.DTI_Tong),
      },
    ],
  };

  const bottom10ChartData = {
    labels: bottom10.map((p) => p.TinhThanh),
    datasets: [
      {
        label: "DTI",
        data: bottom10.map((p) => p.DTI_Tong),
      },
    ],
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
        <HorizontalBarChart
          chartData={top10ChartData}
          title="Top 10 DTI Cao nhất"
          color="0, 185, 107"
        />
      </Col>
      <Col span={12}>
        <HorizontalBarChart
          chartData={bottom10ChartData}
          title="Top 10 DTI Thấp nhất"
          color="255, 99, 132"
        />
      </Col>
    </Row>
  );
};

export default RankingCharts;
