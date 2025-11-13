// src/components/map/Legend.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Hàm getColor (giống hệt trong VietnamMap.jsx)
const getColor = (dti) => {
  if (!dti) return "#808080";
  return dti > 75
    ? "#a50f15" // Đỏ đậm nhất
    : dti > 70
    ? "#de2d26" // Đỏ vừa
    : dti > 65
    ? "#fb6a4a" // Cam đỏ
    : "#fcae91"; // Cam nhạt nhất
};

function Legend() {
  const map = useMap();

  useEffect(() => {
    // Tạo một L.Control mới ở vị trí 'bottomright'
    const legend = L.control({ position: "bottomright" });

    // Hàm onAdd sẽ được gọi khi control được thêm vào bản đồ
    legend.onAdd = function () {
      // Tạo một div với class 'info legend'
      const div = L.DomUtil.create("div", "info legend");

      const labels = ["<h4>Chú thích DTI</h4>"]; // Tiêu đề

      // Thêm các dải màu và nhãn
      labels.push(
        `<i style="background:${getColor(76)}"></i> &gt; 75% (Rất cao)`
      );
      labels.push(
        `<i style="background:${getColor(71)}"></i> 70% &ndash; 75% (Cao)`
      );
      labels.push(
        `<i style="background:${getColor(66)}"></i> 65% &ndash; 70% (Khá)`
      );
      labels.push(
        `<i style="background:${getColor(64)}"></i> &lt; 65% (Trung bình)`
      );
      labels.push('<i style="background:#808080"></i> Không có dữ liệu');

      div.innerHTML = labels.join("<br>");
      return div;
    };

    // Thêm Chú thích vào bản đồ
    legend.addTo(map);

    // Hàm cleanup: Xóa Chú thích khi component bị unmount
    return () => {
      legend.remove();
    };
  }, [map]); // useEffect sẽ chạy lại nếu 'map' thay đổi

  // Component này không render gì cả, nó chỉ tác động lên đối tượng map
  return null;
}

export default Legend;
