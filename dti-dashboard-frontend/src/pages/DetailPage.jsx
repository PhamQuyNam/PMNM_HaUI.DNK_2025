// // src/pages/DetailPage.jsx
// import React, { useMemo } from "react";
// import { useParams, Link } from "react-router-dom";
// // ĐÃ XÓA 'theme' khỏi import
// import { Button, Card, Row, Col, Spin, Statistic, Tabs } from "antd";
// import {
//   ArrowLeftOutlined,
//   RadarChartOutlined,
//   BarChartOutlined,
// } from "@ant-design/icons";

// import { useData } from "../contexts/DataContext.jsx";
// import TrendLineChart from "../components/charts/TrendLineChart.jsx";
// import DTIRadarChart from "../components/charts/DTIRadarChart.jsx";
// import DVCBarChart from "../components/charts/DVCBarChart.jsx";

// // ĐÃ XÓA HÀM glassmorphismStyle

// const DetailPage = () => {
//   const { provinceName } = useParams();
//   const { masterData, isLoading } = useData();

//   // ĐÃ XÓA theme.useToken()

//   const { provinceDataOverTime, latestData } = useMemo(() => {
//     if (!masterData || masterData.length === 0) {
//       return { provinceDataOverTime: [], latestData: null };
//     }
//     const data = masterData
//       .filter((p) => p.TinhThanh === provinceName)
//       .sort((a, b) => a.Nam - b.Nam);
//     const latest = data[data.length - 1];
//     return { provinceDataOverTime: data, latestData: latest };
//   }, [masterData, provinceName]);

//   if (isLoading || !latestData) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "60vh",
//         }}
//       >
//         <Spin
//           tip={`Đang tải dữ liệu chi tiết cho ${provinceName}...`}
//           size="large"
//         />
//       </div>
//     );
//   }

//   // Cấu hình Tabs (Không đổi)
//   const breakdownItems = [
//     {
//       key: "1",
//       label: (
//         <span>
//           <RadarChartOutlined style={{ marginRight: "8px" }} />
//           Phân rã DTI
//         </span>
//       ),
//       children: <DTIRadarChart latestData={latestData} />,
//     },
//     {
//       key: "2",
//       label: (
//         <span>
//           <BarChartOutlined style={{ marginRight: "8px" }} />
//           Phân rã Dịch vụ công
//         </span>
//       ),
//       children: <DVCBarChart latestData={latestData} />,
//     },
//   ];

//   return (
//     <div>
//       <Button
//         type="primary"
//         icon={<ArrowLeftOutlined />}
//         style={{ marginBottom: 16 }}
//       >
//         <Link to="/">Quay lại Dashboard Tổng quan</Link>
//       </Button>

//       <h1>Chi Tiết Tỉnh {provinceName}</h1>

//       {/* 5 Thẻ KPI (Đã xóa style) */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={5}>
//           <Card bordered={false} className="dashboard-card">
//             <Statistic
//               title="DTI Tổng (Năm 2024) (%)"
//               value={(latestData.DTI_Tong * 100).toFixed(2)}
//               suffix="%"
//             />
//           </Card>
//         </Col>
//         <Col span={5}>
//           <Card bordered={false} className="dashboard-card">
//             <Statistic
//               title="GRDP/người"
//               value={latestData.GRDP_BinhQuan}
//               suffix="triệu"
//             />
//           </Card>
//         </Col>
//         <Col span={5}>
//           <Card bordered={false} className="dashboard-card">
//             <Statistic
//               title="Điểm Dịch vụ công"
//               value={latestData.TongDiem_DVC.toFixed(2)}
//               suffix="điểm"
//             />
//           </Card>
//         </Col>
//         <Col span={5}>
//           <Card bordered={false} className="dashboard-card">
//             <Statistic title="Dân số" value={latestData.DanSo} suffix="nghìn" />
//           </Card>
//         </Col>
//         <Col span={4}>
//           <Card bordered={false} className="dashboard-card">
//             <Statistic
//               title="Đô thị hóa"
//               value={latestData.TyLeThanhThi.toFixed(2)}
//               suffix="%"
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Biểu đồ xu hướng & Phân rã (Đã xóa style) */}
//       <Row gutter={16}>
//         <Col span={12}>
//           <Card
//             title="Biểu đồ Xu hướng (3 năm)"
//             bordered={false}
//             className="dashboard-card"
//           >
//             <TrendLineChart provinceData={provinceDataOverTime} />
//           </Card>
//         </Col>
//         <Col span={12}>
//           <Card
//             title="Biểu đồ Phân rã (Năm 2024)"
//             bordered={false}
//             className="dashboard-card"
//           >
//             <Tabs defaultActiveKey="1" items={breakdownItems} />
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DetailPage;
// src/pages/DetailPage.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Row, Col, Spin, Statistic, Tabs, theme } from "antd";
import {
  ArrowLeftOutlined,
  RadarChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import { useData } from "../contexts/DataContext.jsx";
import TrendLineChart from "../components/charts/TrendLineChart.jsx";
import DTIRadarChart from "../components/charts/DTIRadarChart.jsx";
import DVCBarChart from "../components/charts/DVCBarChart.jsx";

// Hàm style kính mờ (vẫn giữ)
const glassmorphismStyle = (borderRadiusLG) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: borderRadiusLG,
});

const DetailPage = () => {
  const { provinceName } = useParams();

  // 1. SỬA: Lấy thêm 'selectedYear' từ Context
  const { masterData, isLoading, selectedYear } = useData();

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  // 2. SỬA: Đổi tên 'latestData' -> 'specificYearData'
  const { provinceDataOverTime, specificYearData } = useMemo(() => {
    if (!masterData || masterData.length === 0) {
      return { provinceDataOverTime: [], specificYearData: null };
    }
    const data = masterData
      .filter((p) => p.TinhThanh === provinceName)
      .sort((a, b) => a.Nam - b.Nam);

    // 3. SỬA: Tìm dữ liệu của năm đã chọn (thay vì lấy năm mới nhất)
    const specificData = data.find((p) => p.Nam === selectedYear);

    return { provinceDataOverTime: data, specificYearData: specificData };
  }, [masterData, provinceName, selectedYear]); // 4. SỬA: Thêm 'selectedYear'

  // 5. SỬA: Dùng 'specificYearData' để kiểm tra
  if (isLoading || !specificYearData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin
          tip={`Đang tải dữ liệu chi tiết cho ${provinceName} (Năm ${selectedYear})...`}
          size="large"
        />
      </div>
    );
  }

  // 6. SỬA: Truyền 'specificYearData' (thay vì latestData)
  const breakdownItems = [
    {
      key: "1",
      label: (
        <span>
          <RadarChartOutlined style={{ marginRight: "8px" }} />
          Phân rã DTI
        </span>
      ),
      children: <DTIRadarChart latestData={specificYearData} />,
    },
    {
      key: "2",
      label: (
        <span>
          <BarChartOutlined style={{ marginRight: "8px" }} />
          Phân rã Dịch vụ công
        </span>
      ),
      children: <DVCBarChart latestData={specificYearData} />,
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
      >
        <Link to="/">Quay lại Dashboard Tổng quan</Link>
      </Button>

      {/* 6. SỬA: Hiển thị năm đã chọn */}
      <h1>
        Chi Tiết Tỉnh {provinceName} (Năm {selectedYear})
      </h1>

      {/* 5 Thẻ KPI (Tất cả 'latestData' được đổi thành 'specificYearData') */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title={`DTI Tổng (Năm ${selectedYear}) (%)`}
              value={(specificYearData.DTI_Tong * 100).toFixed(2)}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title="GRDP/người"
              value={specificYearData.GRDP_BinhQuan}
              suffix="triệu"
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title="Điểm Dịch vụ công"
              value={specificYearData.TongDiem_DVC.toFixed(2)}
              suffix="điểm"
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title="Dân số"
              value={specificYearData.DanSo}
              suffix="nghìn"
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title="Đô thị hóa"
              value={specificYearData.TyLeThanhThi.toFixed(2)}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ xu hướng & Phân rã */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Biểu đồ Xu hướng (3 năm)"
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            {/* 'provinceDataOverTime' vẫn đúng (không đổi) */}
            <TrendLineChart provinceData={provinceDataOverTime} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={`Biểu đồ Phân rã (Năm ${selectedYear})`}
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Tabs defaultActiveKey="1" items={breakdownItems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetailPage;
