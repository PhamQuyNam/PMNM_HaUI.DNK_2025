// src/components/map/VietnamMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import axios from "axios";
import { Spin } from "antd";

const VIETNAM_GEOJSON_URL = "/vietnam-provinces.geojson"; // Đọc từ file local
const center = [16.047079, 108.20623];
const zoom = 6;

const getColor = (dti) => {
  if (!dti) return "#808080"; // Màu xám cho không có dữ liệu
  return dti > 75 // DTI cao nhất (trên 75) -> Đỏ đậm nhất
    ? "#a50f15" // Ví dụ: Đỏ đậm
    : dti > 70 // DTI từ 70 đến 75 -> Đỏ vừa
    ? "#de2d26" // Ví dụ: Đỏ vừa
    : dti > 65 // DTI từ 65 đến 70 -> Cam/đỏ nhạt
    ? "#fb6a4a" // Ví dụ: Cam đỏ
    : "#fcae91"; // DTI thấp nhất (dưới 65) -> Cam nhạt nhất
};

// 1. === HÀM CHUẨN HÓA TÊN (ĐỂ SỬA LỖI) ===
// Hàm này sẽ biến "Thành phố Hà Nội" -> "Hà Nội"
// và "TP. Hồ Chí Minh" -> "Hồ Chí Minh"
const normalizeName = (name) => {
  if (!name) return "";
  return name
    .toLowerCase() // 1. Chuyển về chữ thường
    .replace("thành phố ", "") // 2. Loại bỏ tiền tố (đã ở chữ thường)
    .replace("tỉnh ", "")
    .replace("tp. ", "")
    .replace(/-/g, "") // 3. Loại bỏ tất cả dấu gạch nối
    .replace(/\s+/g, ""); // 4. Loại bỏ tất cả khoảng trắng
  // Ví dụ: "Bà Rịa - Vũng Tàu" -> "bàrịavũngtàu"
  // "TP. Hồ Chí Minh" -> "hồchíminh"
};

const styleGeoJSON = (feature) => {
  const dti = feature.properties.DTI_Tong;
  if (dti) {
    return {
      fillColor: getColor(dti),
      weight: 1,
      opacity: 1,
      color: "white",
      fillOpacity: 0.7,
    };
  } else {
    return {
      fillColor: "#808080",
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 0.3,
    };
  }
};

const VietnamMap = ({ year, data, onProvinceClick }) => {
  const [mergedGeoJson, setMergedGeoJson] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMergedGeoJson(null);

        const response = await axios.get(VIETNAM_GEOJSON_URL);
        const geoJsonData = response.data;

        // 2. === SỬA LOGIC "GHÉP" (MERGE) ===
        // Tạo Map (Ánh xạ) với tên đã được chuẩn hóa
        const dataMap = new Map(
          data.map((item) => [normalizeName(item.TinhThanh), item])
        );

        // Sắp xếp
        const sortedData = [...data].sort((a, b) => b.DTI_Tong - a.DTI_Tong);
        const rankMap = new Map(
          sortedData.map((item, index) => [
            normalizeName(item.TinhThanh),
            index + 1,
          ])
        );

        const mergedFeatures = geoJsonData.features.map((feature) => {
          // Chuẩn hóa tên tỉnh từ file bản đồ
          const provinceName = feature.properties.ten_tinh;
          const normalizedGeoName = normalizeName(provinceName);

          // Lấy dữ liệu bằng tên đã chuẩn hóa
          const provinceData = dataMap.get(normalizedGeoName);

          if (provinceData) {
            feature.properties.DTI_Tong = provinceData.DTI_Tong;
            feature.properties.Rank = `${rankMap.get(normalizedGeoName)}/34`;
            feature.properties.DisplayName = provinceData.TinhThanh; // Giữ tên gốc
          } else {
            feature.properties.DTI_Tong = null;
            feature.properties.Rank = "N/A";
            feature.properties.DisplayName = provinceName; // Dùng tên từ GeoJSON
          }
          return feature;
        });
        // ===================================

        setMergedGeoJson({ ...geoJsonData, features: mergedFeatures });
      } catch (error) {
        console.error("Lỗi tải hoặc ghép GeoJSON:", error);
      }
    };

    fetchData();
  }, [data]); // Phụ thuộc vào 'data'

  const onEachFeature = (feature, layer) => {
    const props = feature.properties;

    // Dùng DisplayName (tên gốc) để hiển thị
    if (props.DTI_Tong) {
      layer.bindTooltip(
        `<b>Tỉnh: ${props.DisplayName}</b><br/>
         DTI: <strong>${props.DTI_Tong.toFixed(2)}% </strong><br/>
         Hạng: <strong>${props.Rank}</strong>`
      );
    } else {
      layer.bindTooltip(
        `<b>Tỉnh: ${props.DisplayName}</b><br/>
         (Không có dữ liệu chi tiết)`
      );
    }

    layer.on({
      click: () => {
        if (props.DTI_Tong && onProvinceClick) {
          onProvinceClick(props.DisplayName);
        }
      },
    });
  };

  if (!mergedGeoJson) {
    return (
      <div
        style={{
          height: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin tip="Đang tải và ghép dữ liệu bản đồ..." size="large" />
      </div>
    );
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "600px", width: "100%" }}
        key={year}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <GeoJSON
          data={mergedGeoJson}
          style={styleGeoJSON}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
};

export default VietnamMap;
