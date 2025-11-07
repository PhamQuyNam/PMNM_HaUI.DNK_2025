// // src/pages/OverviewPage.jsx
// import React, { useState, useMemo } from "react";
// import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
// import {
//   theme,
//   Card,
//   Row,
//   Col,
//   Select,
//   Space,
//   Statistic,
//   Table,
//   Spin,
// } from "antd";
// import { useNavigate } from "react-router-dom";

// import VietnamMap from "../components/map/VietnamMap.jsx";
// import RankingCharts from "../components/charts/RankingCharts.jsx";
// import RelationshipScatterPlot from "../components/charts/RelationshipScatterPlot.jsx";
// import { useData } from "../contexts/DataContext.jsx";

// const columns = [
//   {
//     title: "Tỉnh/Thành phố",
//     dataIndex: "TinhThanh",
//     key: "TinhThanh",
//     sorter: (a, b) => a.TinhThanh.localeCompare(b.TinhThanh),
//   },
//   {
//     title: "Chỉ số DTI (Tổng) (%)",
//     dataIndex: "DTI_Tong",
//     key: "DTI_Tong",
//     sorter: (a, b) => a.DTI_Tong - b.DTI_Tong,
//     // --- THÊM PHẦN NÀY VÀO ---
//     render: (value) => {
//       if (typeof value === "number") {
//         return value.toFixed(2); // Làm tròn 2 chữ số
//       }
//       return "N/A"; // Hiển thị 'N/A' nếu không phải số
//     },
//     //
//   },
//   {
//     title: "GRDP/người (triệu)",
//     dataIndex: "GRDP_BinhQuan",
//     key: "GRDP_BinhQuan",
//     sorter: (a, b) => a.GRDP_BinhQuan - b.GRDP_BinhQuan,
//   },
//   {
//     title: "Dân số (nghìn)",
//     dataIndex: "DanSo",
//     key: "DanSo",
//     sorter: (a, b) => a.DanSo - b.DanSo,
//   },
// ];

// const glassmorphismStyle = (borderRadiusLG) => ({
//   background: "rgba(255, 255, 255, 0.1)",
//   backdropFilter: "blur(10px)",
//   border: "1px solid rgba(255, 255, 255, 0.2)",
//   boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
//   borderRadius: borderRadiusLG,
// });

// // === HÀM CHUYỂN ĐỔI (ĐỂ NHÂN 100) ===
// const transformData = (dataArray) => {
//   return dataArray.map((p) => {
//     const newProps = { ...p };
//     for (const key in newProps) {
//       if (
//         key.startsWith("DTI_") ||
//         key.startsWith("HaTangSo") ||
//         [
//           "CongKhaiMinhBach",
//           "TienDoGiaiQuyet",
//           "DichVuTrucTuyen",
//           "MucDoHaiLong",
//           "SoHoaHoSo",
//         ].includes(key)
//       ) {
//         if (typeof newProps[key] === "number" && newProps[key] < 2) {
//           newProps[key] = newProps[key] * 100; // 0.8002 -> 80.02
//         }
//       }
//     }
//     return newProps;
//   });
// };
// // ======================================

// const OverviewPage = () => {
//   const [selectedYear, setSelectedYear] = useState(2024);
//   const {
//     token: { borderRadiusLG },
//   } = theme.useToken();
//   const navigate = useNavigate();

//   const { masterData, isLoading } = useData();

//   const { dashboardData, processedData } = useMemo(() => {
//     // 1. Lọc dữ liệu thô
//     const dataForYear_raw = masterData.filter((p) => p.Nam === selectedYear);
//     const dataForPrevYear_raw = masterData.filter(
//       (p) => p.Nam === selectedYear - 1
//     );

//     // 2. BIẾN ĐỔI (Nhân 100)
//     const dataForYear = transformData(dataForYear_raw);
//     const dataForPrevYear = transformData(dataForPrevYear_raw);

//     const getSafeAvg = (data, key) => {
//       if (!data || data.length === 0) return 0;
//       const sum = data.reduce((acc, p) => acc + (p[key] || 0), 0);
//       return sum / data.length;
//     };

//     const avgDTI = getSafeAvg(dataForYear, "DTI_Tong");
//     const prevAvgDTI = getSafeAvg(dataForPrevYear, "DTI_Tong");
//     const avgGDP = getSafeAvg(dataForYear, "GRDP_BinhQuan");
//     const avgUrban = getSafeAvg(dataForYear, "TyLeThanhThi");

//     return {
//       dashboardData: {
//         avgDTI: avgDTI.toFixed(2),
//         prevAvgDTI: prevAvgDTI,
//         dtiChange: (avgDTI - prevAvgDTI).toFixed(2),
//         avgGDP: avgGDP.toFixed(2),
//         avgUrban: avgUrban.toFixed(2),
//       },
//       processedData: dataForYear.map((item) => ({
//         ...item,
//         key: item.TinhThanh,
//       })),
//     };
//   }, [selectedYear, masterData]);

//   if (isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "60vh",
//         }}
//       >
//         <Spin tip="Đang tải 102 dòng dữ liệu từ /api/data..." size="large" />
//       </div>
//     );
//   }

//   const handleProvinceClick = (provinceName) => {
//     navigate(`/province/${provinceName}`);
//   };

//   return (
//     <>
//       <Space style={{ marginBottom: 16 }}>
//         <b>Chọn năm:</b>
//         <Select
//           defaultValue={selectedYear}
//           style={{ width: 120 }}
//           onChange={(value) => setSelectedYear(value)}
//           options={[
//             { value: 2024, label: "Năm 2024" },
//             { value: 2023, label: "Năm 2023" },
//             { value: 2022, label: "Năm 2022" },
//           ]}
//         />
//       </Space>

//       {/* Hàng 1: Thống kê */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={8}>
//           <Card
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <Statistic
//               title={`DTI Trung bình 34 tỉnh (${selectedYear})`}
//               value={dashboardData.avgDTI}
//               precision={2}
//               valueStyle={
//                 dashboardData.prevAvgDTI > 0
//                   ? dashboardData.dtiChange >= 0
//                     ? { color: "#3f8600" }
//                     : { color: "#cf1322" }
//                   : {}
//               }
//               prefix={
//                 dashboardData.prevAvgDTI > 0 ? (
//                   dashboardData.dtiChange >= 0 ? (
//                     <ArrowUpOutlined />
//                   ) : (
//                     <ArrowDownOutlined />
//                   )
//                 ) : null
//               }
//               suffix="%" // SỬA: Đơn vị là %
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <Statistic
//               title={`GDP/người TB (${selectedYear})`}
//               value={dashboardData.avgGDP}
//               precision={2}
//               suffix="triệu"
//             />
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <Statistic
//               title={`Đô thị hóa TB (${selectedYear})`}
//               value={dashboardData.avgUrban}
//               precision={2}
//               suffix="%"
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Hàng 2: Bản đồ và Biểu đồ cột */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={12}>
//           <Card
//             title={`Bản đồ Choropleth DTI ${selectedYear}`}
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <VietnamMap
//               year={selectedYear}
//               onProvinceClick={handleProvinceClick}
//               data={processedData}
//             />
//           </Card>
//         </Col>
//         <Col span={12}>
//           <Card
//             title={`Xếp hạng DTI ${selectedYear}`}
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <RankingCharts data={processedData} />
//           </Card>
//         </Col>
//       </Row>

//       {/* Hàng 3: Bảng dữ liệu */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={24}>
//           <Card
//             title={`Dữ liệu chi tiết 34 tỉnh (Năm ${selectedYear})`}
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <Table
//               columns={columns}
//               dataSource={processedData}
//               pagination={{ pageSize: 5 }}
//               onRow={(record) => ({
//                 onClick: () => handleProvinceClick(record.TinhThanh),
//               })}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Hàng 4: Biểu đồ Phân tán */}
//       <Row gutter={16} style={{ marginBottom: 16 }}>
//         <Col span={24}>
//           <Card
//             title={`Phân tích Mối liên hệ (GRDP vs DTI) năm ${selectedYear}`}
//             bordered={false}
//             style={glassmorphismStyle(borderRadiusLG)}
//             className="dashboard-card"
//           >
//             <RelationshipScatterPlot
//               data={processedData}
//               avgGDP={parseFloat(dashboardData.avgGDP)}
//               avgDTI={parseFloat(dashboardData.avgDTI)}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// export default OverviewPage;
// src/pages/OverviewPage.jsx
import React, { useMemo } from "react"; // Xóa 'useState' vì không cần nữa
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  theme,
  Card,
  Row,
  Col,
  Select,
  Space,
  Statistic,
  Table,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";

import VietnamMap from "../components/map/VietnamMap.jsx";
import RankingCharts from "../components/charts/RankingCharts.jsx";
import RelationshipScatterPlot from "../components/charts/RelationshipScatterPlot.jsx";
import { useData } from "../contexts/DataContext.jsx"; // (Context)

// (Hàm columns không đổi)
const columns = [
  {
    title: "Tỉnh/Thành phố",
    dataIndex: "TinhThanh",
    key: "TinhThanh",
    sorter: (a, b) => a.TinhThanh.localeCompare(b.TinhThanh),
  },
  {
    title: "Chỉ số DTI (Tổng) (%)",
    dataIndex: "DTI_Tong",
    key: "DTI_Tong",
    sorter: (a, b) => a.DTI_Tong - b.DTI_Tong,
    render: (value) => {
      if (typeof value === "number") {
        return value.toFixed(2);
      }
      return "N/A";
    },
  },
  {
    title: "GRDP/người (triệu)",
    dataIndex: "GRDP_BinhQuan",
    key: "GRDP_BinhQuan",
    sorter: (a, b) => a.GRDP_BinhQuan - b.GRDP_BinhQuan,
  },
  {
    title: "Dân số (nghìn)",
    dataIndex: "DanSo",
    key: "DanSo",
    sorter: (a, b) => a.DanSo - b.DanSo,
  },
];

// (Hàm glassmorphismStyle không đổi)
const glassmorphismStyle = (borderRadiusLG) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: borderRadiusLG,
});

// (Hàm transformData không đổi)
const transformData = (dataArray) => {
  return dataArray.map((p) => {
    const newProps = { ...p };
    for (const key in newProps) {
      if (
        key.startsWith("DTI_") ||
        key.startsWith("HaTangSo") ||
        [
          "CongKhaiMinhBach",
          "TienDoGiaiQuyet",
          "DichVuTrucTuyen",
          "MucDoHaiLong",
          "SoHoaHoSo",
        ].includes(key)
      ) {
        if (typeof newProps[key] === "number" && newProps[key] < 2) {
          newProps[key] = newProps[key] * 100; // 0.8002 -> 80.02
        }
      }
    }
    return newProps;
  });
};

const OverviewPage = () => {
  // 1. SỬA: XÓA useState CỤC BỘ (local)
  // const [selectedYear, setSelectedYear] = useState(2024); // <-- XÓA DÒNG NÀY

  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  // 2. SỬA: Lấy selectedYear và setSelectedYear từ CONTEXT (global)
  const { masterData, isLoading, selectedYear, setSelectedYear } = useData();

  const { dashboardData, processedData } = useMemo(() => {
    // (Logic useMemo của bạn không cần sửa, nó đã đúng)
    const dataForYear_raw = masterData.filter((p) => p.Nam === selectedYear);
    const dataForPrevYear_raw = masterData.filter(
      (p) => p.Nam === selectedYear - 1
    );
    const dataForYear = transformData(dataForYear_raw);
    const dataForPrevYear = transformData(dataForPrevYear_raw);
    const getSafeAvg = (data, key) => {
      if (!data || data.length === 0) return 0;
      const sum = data.reduce((acc, p) => acc + (p[key] || 0), 0);
      return sum / data.length;
    };
    const avgDTI = getSafeAvg(dataForYear, "DTI_Tong");
    const prevAvgDTI = getSafeAvg(dataForPrevYear, "DTI_Tong");
    const avgGDP = getSafeAvg(dataForYear, "GRDP_BinhQuan");
    const avgUrban = getSafeAvg(dataForYear, "TyLeThanhThi");
    return {
      dashboardData: {
        avgDTI: avgDTI.toFixed(2),
        prevAvgDTI: prevAvgDTI,
        dtiChange: (avgDTI - prevAvgDTI).toFixed(2),
        avgGDP: avgGDP.toFixed(2),
        avgUrban: avgUrban.toFixed(2),
      },
      processedData: dataForYear.map((item) => ({
        ...item,
        key: item.TinhThanh,
      })),
    };
  }, [selectedYear, masterData]);

  if (isLoading) {
    // (Spin không đổi)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin tip="Đang tải 102 dòng dữ liệu từ /api/data..." size="large" />
      </div>
    );
  }

  const handleProvinceClick = (provinceName) => {
    // (Hàm này không đổi)
    navigate(`/province/${provinceName}`);
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <b>Chọn năm:</b>
        <Select
          defaultValue={selectedYear} // 3. SỬA: 'defaultValue' giờ là từ Context
          style={{ width: 120 }}
          onChange={(value) => setSelectedYear(value)} // 3. SỬA: 'onChange' giờ cập nhật Context
          options={[
            { value: 2024, label: "Năm 2024" },
            { value: 2023, label: "Năm 2023" },
            { value: 2022, label: "Năm 2022" },
          ]}
        />
      </Space>

      {/* (Toàn bộ phần JSX còn lại (Row, Col, Card, Table...) 
          của bạn không cần sửa, đã đúng) */}

      {/* Hàng 1: Thống kê */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title={`DTI Trung bình 34 tỉnh (${selectedYear})`}
              value={dashboardData.avgDTI}
              precision={2}
              valueStyle={
                dashboardData.prevAvgDTI > 0
                  ? dashboardData.dtiChange >= 0
                    ? { color: "#3f8600" }
                    : { color: "#cf1322" }
                  : {}
              }
              prefix={
                dashboardData.prevAvgDTI > 0 ? (
                  dashboardData.dtiChange >= 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                ) : null
              }
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title={`GDP/người TB (${selectedYear})`}
              value={dashboardData.avgGDP}
              precision={2}
              suffix="triệu"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title={`Đô thị hóa TB (${selectedYear})`}
              value={dashboardData.avgUrban}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Bản đồ và Biểu đồ cột */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            title={`Bản đồ Choropleth DTI ${selectedYear}`}
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <VietnamMap
              year={selectedYear}
              onProvinceClick={handleProvinceClick}
              data={processedData}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={`Xếp hạng DTI ${selectedYear}`}
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <RankingCharts data={processedData} />
          </Card>
        </Col>
      </Row>

      {/* Hàng 3: Bảng dữ liệu */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card
            title={`Dữ liệu chi tiết 34 tỉnh (Năm ${selectedYear})`}
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Table
              columns={columns}
              dataSource={processedData}
              pagination={{ pageSize: 5 }}
              onRow={(record) => ({
                onClick: () => handleProvinceClick(record.TinhThanh),
              })}
            />
          </Card>
        </Col>
      </Row>

      {/* Hàng 4: Biểu đồ Phân tán */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card
            title={`Phân tích Mối liên hệ (GRDP vs DTI) năm ${selectedYear}`}
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <RelationshipScatterPlot
              data={processedData}
              avgGDP={parseFloat(dashboardData.avgGDP)}
              avgDTI={parseFloat(dashboardData.avgDTI)}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OverviewPage;
