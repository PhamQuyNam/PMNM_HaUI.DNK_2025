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

        // --- 1. SỬA LỖI: NHÂN VỚI 100 ---
        data: [
          latestData.DTI_ChinhQuyenSo * 100,
          latestData.DTI_KinhTeSo * 100,
          latestData.DTI_XaHoiSo * 100,
          latestData.HaTangSo * 100,
        ],
        // ---------------------------------

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
      legend: { position: "top", labels: {} },
      title: { display: true, text: "Phân rã 4 Trụ cột DTI" },

      // --- 2. SỬA LỖI: THÊM TOOLTIP CALLBACK ---
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            // Thêm % vào tooltip khi hover
            label += context.parsed.r.toFixed(2) + "%";
            return label;
          },
        },
      },
      // -------------------------------------
    },
    scales: {
      r: {
        // --- 3. SỬA LỖI: THÊM MAX VÀ TICKS CALLBACK ---
        max: 100, // Đặt thang đo 0-100
        min: 0,
        ticks: {
          // Thêm % vào các vạch chia (25, 50, 75, 100)
          callback: function (value) {
            return value + "%";
          },
          backdropColor: "rgba(255, 255, 255, 0.8)",
          backdropPadding: 2,
        },
        // -------------------------------------------
        angleLines: { color: "rgba(0, 0, 0, 0.1)" },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        pointLabels: {},
      },
    },
  };

  return <Radar data={data} options={options} style={{ height: "300px" }} />;
};

export default DTIRadarChart;
