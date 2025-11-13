// src/components/charts/RelationshipScatterPlot.jsx
import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  annotationPlugin
);

// Hàm chuẩn hóa bán kính (ĐÃ NÂNG CẤP DÙNG LOG SCALE)
const scaleRadius = (population, minPop, maxPop) => {
  // 1. Tăng dải bán kính
  const minRadius = 6; // Tăng bán kính nhỏ nhất lên một chút
  const maxRadius = 30; // Tăng từ 25 lên 30

  // 2. Áp dụng Log Scale (log10)
  // (Dùng Math.max(1, ...) để tránh log(0) nếu dân số là 0)
  const logPop = Math.log10(Math.max(1, population));
  const logMinPop = Math.log10(Math.max(1, minPop));
  const logMaxPop = Math.log10(Math.max(1, maxPop));

  // Tránh trường hợp chia cho 0
  if (logMaxPop === logMinPop) return minRadius;

  // 3. Chuẩn hóa tuyến tính DỰA TRÊN CÁC GIÁ TRỊ LOG
  // Đây là thang đo chuẩn cho dữ liệu phân bổ rộng như dân số
  return (
    ((logPop - logMinPop) / (logMaxPop - logMinPop)) * (maxRadius - minRadius) +
    minRadius
  );
};

// === COMPONENT ĐÃ NÂNG CẤP ===
const RelationshipScatterPlot = ({ data, avgGDP, avgDTI }) => {
  // 1. Phân loại dữ liệu thành 4 nhóm (quadrants)
  const chartData = useMemo(() => {
    // Tìm min/max dân số
    const populations = data.map((p) => p.DanSo);
    const minPop = Math.min(...populations);
    const maxPop = Math.max(...populations);

    // 4 Nhóm dữ liệu
    const q1_TopRight = []; // Lý tưởng (Xanh lá)
    const q2_TopLeft = []; // Vượt khó (Xanh dương)
    const q3_BottomLeft = []; // Cần nỗ lực (Vàng/Cam)
    const q4_BottomRight = []; // Giàu, CĐS chưa mạnh (Đỏ)

    // Hàm tạo bubble (giữ thông tin gốc)
    const createBubble = (p) => ({
      x: p.GRDP_BinhQuan,
      y: p.DTI_Tong,
      r: scaleRadius(p.DanSo, minPop, maxPop),
      label: p.TinhThanh,
      population: p.DanSo,
    });

    // Lặp 1 lần duy nhất để phân loại
    for (const province of data) {
      const bubble = createBubble(province);
      if (bubble.x > avgGDP && bubble.y > avgDTI) {
        q1_TopRight.push(bubble);
      } else if (bubble.x <= avgGDP && bubble.y > avgDTI) {
        q2_TopLeft.push(bubble);
      } else if (bubble.x <= avgGDP && bubble.y <= avgDTI) {
        q3_BottomLeft.push(bubble);
      } else {
        q4_BottomRight.push(bubble);
      }
    }

    // 2. Trả về cấu trúc 4 datasets
    return {
      datasets: [
        {
          label: "Nhóm 1: Lý tưởng (GRDP Cao, DTI Cao)",
          data: q1_TopRight,
          backgroundColor: "rgba(0, 185, 107, 0.6)", // Xanh lá (theme)
          borderColor: "rgba(0, 185, 107, 1)",
        },
        {
          label: "Nhóm 2: Vượt khó (GRDP Thấp, DTI Cao)",
          data: q2_TopLeft,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Xanh dương
          borderColor: "rgba(54, 162, 235, 1)",
        },
        {
          label: "Nhóm 4: Cảnh báo (GRDP Cao, DTI Thấp)",
          data: q4_BottomRight,
          backgroundColor: "rgba(255, 99, 132, 0.6)", // Đỏ
          borderColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "Nhóm 3: Cần nỗ lực (GRDP Thấp, DTI Thấp)",
          data: q3_BottomLeft,
          backgroundColor: "rgba(255, 206, 86, 0.6)", // Vàng
          borderColor: "rgba(255, 206, 86, 1)",
        },
      ],
    };
  }, [data, avgGDP, avgDTI]);

  // 3. Cấu hình (Options)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Hiển thị 4 nhóm
        labels: { padding: 15 },
      },
      title: {
        display: true,
        text: "Trục X: GRDP/người  |  Trục Y: DTI (%)",
        padding: { bottom: 20 },
        font: { size: 14 },
      },
      // ...
      // ...
      tooltip: {
        callbacks: {
          // 1. Dùng 'label' để hiển thị Tên Tỉnh (sẽ tự động kèm ô màu)
          label: function (context) {
            const item = context.dataset.data[context.dataIndex];
            return item.label || ""; // Ví dụ: "Hà Nội"
          },

          // 2. Dùng 'afterLabel' để hiển thị 3 dòng dữ liệu
          afterLabel: function (context) {
            const item = context.dataset.data[context.dataIndex];
            const popString = item.population.toLocaleString("vi-VN");

            // Tạo một mảng các dòng
            const lines = [
              `GRDP: ${context.parsed.x.toFixed(2)} (triệu)`,
              `DTI: ${context.parsed.y.toFixed(2)}%`,
              `Dân số: ${popString} (nghìn)`,
            ];

            return lines; // Chart.js sẽ tự ngắt dòng cho mảng này
          },
        },
      },
      // ...
      // ...
      // Thêm đường kẻ trung bình (tùy chọn nâng cao)
      annotation: {
        annotations: {
          avgGDPLine: {
            type: "line",
            xMin: avgGDP,
            xMax: avgGDP,
            borderColor: "rgba(248, 4, 4, 0.3)",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `GRDP TB: ${avgGDP.toFixed(2)}`,
              enabled: true, // <-- 1. SỬA LẠI THÀNH 'true'
              display: false, // <-- 2. THÊM DÒNG NÀY (Ẩn mặc định)
              position: "start",
              font: { size: 10 },
            },

            // --- 3. THÊM 2 HÀM SỰ KIỆN NÀY VÀO ---
            // Khi chuột di vào đường kẻ
            enter(context) {
              context.element.label.options.display = true; // Hiện label
              context.chart.draw(); // Vẽ lại chart
            },
            // Khi chuột di ra
            leave(context) {
              context.element.label.options.display = false; // Ẩn label
              context.chart.draw(); // Vẽ lại chart
            },
            // ------------------------------------
          },
          avgDTILine: {
            type: "line",
            yMin: avgDTI,
            yMax: avgDTI,
            borderColor: "rgba(250, 2, 2, 0.3)",
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              content: `DTI TB: ${avgDTI.toFixed(2)}%`,
              enabled: true, // <-- 1. SỬA LẠI THÀNH 'true'
              display: false, // <-- 2. THÊM DÒNG NÀY (Ẩn mặc định)
              position: "end",
              font: { size: 10 },
            },

            // --- 3. THÊM 2 HÀM SỰ KIỆN NÀY VÀO ---
            // Khi chuột di vào đường kẻ
            enter(context) {
              context.element.label.options.display = true; // Hiện label
              context.chart.draw(); // Vẽ lại chart
            },
            // Khi chuột di ra
            leave(context) {
              context.element.label.options.display = false; // Ẩn label
              context.chart.draw(); // Vẽ lại chart
            },
            // ------------------------------------
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "GRDP/người (triệu đồng)" },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
      y: {
        title: { display: true, text: "Chỉ số DTI (%)" },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  };

  // Cần đăng ký plugin annotation (nếu chưa có)
  // (ChartJS.register(annotationPlugin);)
  // Nhưng trong code này, Chart.js 4+ thường tự động xử lý.

  return <Scatter options={options} data={chartData} />;
};

export default RelationshipScatterPlot;
