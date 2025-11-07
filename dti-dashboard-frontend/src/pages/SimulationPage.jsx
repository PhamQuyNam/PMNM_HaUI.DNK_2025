// src/pages/SimulationPage.jsx
import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  theme,
  Spin,
  InputNumber,
  Button,
  Progress,
  Space,
  Typography,
  Slider,
  // ĐÃ XÓA TABS
} from "antd";
// ĐÃ XÓA ICONS
import { useData } from "../contexts/DataContext.jsx";
import { predictDTI } from "../services/api.js";

const { Text, Title, Paragraph } = Typography;

// 9 Đặc trưng (Không đổi)
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
  { key: "TyLeThanhThi", label: "Đô thị hóa (%)", min: 10, max: 100, step: 1 },
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

// ĐÃ XÓA group1Keys

// Giá trị mặc định (Không đổi)
const defaultFeatures = featuresConfig.reduce((acc, f) => {
  acc[f.key] = f.min;
  return acc;
}, {});

// Style "Kính mờ" (Không đổi)
const glassmorphismStyle = (borderRadiusLG) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: borderRadiusLG,
});

// HÀM PHÂN TÍCH KẾT QUẢ (Không đổi)
const getDtiResult = (score) => {
  if (score > 75) return { text: "Rất cao", color: "#00b96b" };
  if (score > 70) return { text: "Cao", color: "#52c41a" };
  if (score > 65) return { text: "Khá", color: "#fadb14" };
  return { text: "Trung bình", color: "#fa8c16" };
};

const SimulationPage = () => {
  const { isLoading } = useData();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const [features, setFeatures] = useState(defaultFeatures);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Hàm xử lý Input (Không đổi)
  const handleInputChange = (key, value) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [key]: value,
    }));
  };

  // Hàm xử lý Click (Không đổi)
  const handlePredictClick = async () => {
    setIsPredicting(true);
    setPrediction(null);
    const result = await predictDTI(features);
    if (result.success) {
      setPrediction(result.predicted_dti);
    } else {
      console.error("Dự đoán thất bại!");
    }
    setIsPredicting(false);
  };

  // COMPONENT NHẬP LIỆU (Không đổi)
  const renderFeatureControl = (f) => (
    <Row key={f.key} align="middle" style={{ marginBottom: 8 }}>
      <Col span={8}>
        <Text>{f.label}:</Text>
      </Col>
      <Col span={12}>
        <Slider
          min={f.min}
          max={f.max}
          step={f.step}
          value={typeof features[f.key] === "number" ? features[f.key] : f.min}
          onChange={(value) => handleInputChange(f.key, value)}
          style={{ margin: "0 8px" }}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={f.min}
          max={f.max}
          step={f.step}
          value={features[f.key]}
          onChange={(value) => handleInputChange(f.key, value)}
          style={{ width: "100%" }}
          size="small"
        />
      </Col>
    </Row>
  );

  if (isLoading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  // RENDER GIAO DIỆN
  return (
    <div>
      {/* TIÊU ĐỀ DẪN DẮT (Không đổi) */}
      <Title level={2}>Mô phỏng và Dự đoán DTI </Title>
      <Paragraph type="secondary" style={{ marginBottom: 24, maxWidth: 800 }}>
        Đây là phòng thí nghiệm mô phỏng. Hãy thử điều chỉnh các chỉ số đầu vào
        (bằng cách kéo thanh trượt hoặc nhập số) để xem Chỉ số DTI (Tổng) dự
        đoán thay đổi như thế nào.
      </Paragraph>

      <Row gutter={[16, 16]}>
        {/* === CỘT INPUT (ĐÃ SỬA LẠI) === */}
        <Col xs={24} md={12}>
          <Card
            title="Điều khiển Mô phỏng"
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            {/* THAY THẾ TABS BẰNG SPACE DUY NHẤT */}
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Render tất cả 9 chỉ số */}
              {featuresConfig.map(renderFeatureControl)}
            </Space>

            {/* NÚT BẤM (Không đổi) */}
            <Button
              type="primary"
              onClick={handlePredictClick}
              loading={isPredicting}
              block
              style={{ marginTop: 24, height: 40, fontSize: 16 }}
            >
              {isPredicting ? "Đang dự đoán..." : "Chạy Dự đoán DTI"}
            </Button>
          </Card>
        </Col>

        {/* === CỘT OUTPUT (Không đổi) === */}
        <Col xs={24} md={12}>
          <Card
            title="Kết quả Dự đoán"
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                minHeight: "380px", // Giữ nguyên chiều cao
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {isPredicting && <Spin tip="Đang gọi API mô hình..." />}
              {!isPredicting && prediction !== null && (
                <>
                  {(() => {
                    // --- BẮT ĐẦU SỬA LỖI TẠI ĐÂY ---

                    // 1. CHUYỂN ĐỔI GIÁ TRỊ (0-1 -> 0-100)
                    // (prediction là giá trị gốc, ví dụ: 0.7254)
                    const dtiScore = prediction * 100; // <-- THÊM PHÉP NHÂN NÀY (dtiScore = 72.54)

                    // 2. Phân tích DÙNG dtiScore (thang 0-100)
                    const result = getDtiResult(dtiScore); // getDtiResult(72.54) -> "Cao"

                    // 3. Làm tròn DÙNG dtiScore (thang 0-100)
                    const percent = parseFloat(dtiScore.toFixed(1)); // percent = 72.5

                    return (
                      <>
                        <Progress
                          type="circle"
                          percent={percent} // <-- Sẽ hiển thị 72.5
                          format={(p) => `${p}% DTI`}
                          strokeColor={result.color}
                          width={200}
                        />
                        <Title
                          level={3}
                          style={{ marginTop: 20, color: result.color }}
                        >
                          {result.text} {/* Sẽ hiển thị "Cao" */}
                        </Title>
                        <Paragraph type="secondary" style={{ fontSize: 16 }}>
                          Với các chỉ số đầu vào này, DTI dự đoán của tỉnh là{" "}
                          <strong>{dtiScore.toFixed(2)}%</strong>.{" "}
                          {/* Sẽ hiển thị "72.54%" */}
                        </Paragraph>
                      </>
                    );
                  })()}
                </>
              )}
              {!isPredicting && prediction === null && (
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Kết quả dự đoán DTI sẽ xuất hiện ở đây sau khi bạn nhấn nút
                  "Chạy Dự đoán".
                </Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SimulationPage;
