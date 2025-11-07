// src/pages/SimulationPage.jsx
import React, { useState } from "react";
// 1. IMPORT CÁC COMPONENT MỚI
import {
  Card,
  Row,
  Col,
  theme,
  Spin,
  InputNumber, // Thay cho Slider
  Button, // Thêm nút "Dự đoán"
  Progress, // Thay cho Gauge Chart
  Space, // Để sắp xếp layout
  Typography, // Để hiển thị nhãn
} from "antd";
import { useData } from "../contexts/DataContext.jsx";
import { predictDTI } from "../services/api.js"; // Import API dự đoán

const { Text } = Typography;

// 2. ĐỊNH NGHĨA 9 ĐẶC TRƯNG (VẪN DÙNG)
// (Bao gồm các giá trị min/max/step cho Input)
const featuresConfig = [
  { key: "HaTangSo", label: "Hạ tầng số", min: 0, max: 1, step: 0.01 },
  { key: "DanSo", label: "Dân số (nghìn)", min: 100, max: 10000, step: 100 },
  {
    key: "GRDP_BinhQuan",
    label: "GRDP/người (triệu)",
    min: 50,
    max: 200,
    step: 1,
  },
  { key: "TyLeThanhThi", label: "Đô thị hóa (%)", min: 10, max: 90, step: 1 },
  {
    key: "CongKhaiMinhBach",
    label: "Công khai minh bạch",
    min: 5,
    max: 20,
    step: 0.5,
  },
  {
    key: "TienDoGiaiQuyet",
    label: "Tiến độ giải quyết",
    min: 5,
    max: 20,
    step: 0.5,
  },
  {
    key: "DichVuTrucTuyen",
    label: "Dịch vụ trực tuyến",
    min: 5,
    max: 20,
    step: 0.5,
  },
  { key: "MucDoHaiLong", label: "Mức độ hài lòng", min: 5, max: 20, step: 0.5 },
  { key: "SoHoaHoSo", label: "Số hóa hồ sơ", min: 5, max: 20, step: 0.5 },
];

// Lấy giá trị mặc định (min)
const defaultFeatures = featuresConfig.reduce((acc, f) => {
  acc[f.key] = f.min;
  return acc;
}, {});

// Style "Kính mờ"
const glassmorphismStyle = (borderRadiusLG) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: borderRadiusLG,
});

const SimulationPage = () => {
  const { isLoading } = useData(); // Chỉ cần biết đã tải xong chưa
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // 3. STATE MỚI
  const [features, setFeatures] = useState(defaultFeatures); // State chứa 9 giá trị input
  const [prediction, setPrediction] = useState(null); // State chứa kết quả
  const [isPredicting, setIsPredicting] = useState(false); // State loading cho nút

  // 4. HÀM XỬ LÝ MỚI
  // Khi người dùng thay đổi 1 ô InputNumber
  const handleInputChange = (key, value) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [key]: value,
    }));
  };

  // Khi nhấn nút "Dự đoán" (theo yêu cầu)
  const handlePredictClick = async () => {
    setIsPredicting(true); // Bật loading
    setPrediction(null); // Xóa kết quả cũ

    const result = await predictDTI(features); // Gọi API thật

    if (result.success) {
      setPrediction(result.predicted_dti); // Cập nhật kết quả
    } else {
      console.error("Dự đoán thất bại!");
    }
    setIsPredicting(false); // Tắt loading
  };

  // 5. RENDER (ĐÃ XÓA CHỮ MÀU TRẮNG)
  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  return (
    <div>
      <h1>Giao diện Mô phỏng Dự đoán "What-if"</h1>

      <Row gutter={16}>
        {/* === CỘT INPUT (9 Ô NHẬP LIỆU) === */}
        <Col span={12}>
          <Card
            title="Khu vực Đầu vào (Input)"
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <p>Nhập 9 đặc trưng đầu vào của mô hình:</p>

            {/* 9 Ô NHẬP LIỆU (InputNumber) */}
            <Space direction="vertical" style={{ width: "100%" }}>
              {featuresConfig.map((f) => (
                <Row key={f.key} align="middle">
                  <Col span={10}>
                    <Text>{f.label}:</Text>
                  </Col>
                  <Col span={14}>
                    <InputNumber
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={features[f.key]}
                      onChange={(value) => handleInputChange(f.key, value)}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              ))}

              {/* NÚT BẤM DỰ ĐOÁN (THEO YÊU CẦU) */}
              <Button
                type="primary"
                onClick={handlePredictClick}
                loading={isPredicting}
                block // Nút chiếm 100%
                style={{ marginTop: 16 }}
              >
                {isPredicting ? "Đang dự đoán..." : "Chạy Dự đoán DTI"}
              </Button>
            </Space>
          </Card>
        </Col>

        {/* === CỘT OUTPUT (VÒNG TRÒN %) === */}
        <Col span={12}>
          <Card
            title="Khu vực Kết quả (Output)"
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              {/* Nếu đang dự đoán, hiện Spin */}
              {isPredicting && <Spin tip="Đang gọi API..." />}

              {/* Nếu có kết quả, hiện vòng tròn */}
              {!isPredicting && prediction !== null && (
                <Progress
                  type="circle" // Hình tròn (theo yêu cầu)
                  percent={Math.round(prediction * 100)} // Làm tròn %
                  format={(percent) => `${percent}% DTI`} // Hiển thị chữ
                  strokeColor={{
                    "0%": "#cf1322", // Đỏ
                    "70%": "#fadb14", // Vàng
                    "100%": "#00b96b", // Xanh (màu theme)
                  }}
                  width={250}
                />
              )}

              {/* Nếu chưa có kết quả */}
              {!isPredicting && prediction === null && (
                <p>
                  Kết quả dự đoán DTI sẽ xuất hiện ở đây sau khi bạn nhấn nút
                  "Chạy Dự đoán".
                </p>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimulationPage;
