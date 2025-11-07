// src/pages/DetailPage.jsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Card, Row, Col, Spin, Statistic, Tabs, theme } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { useData } from "../contexts/DataContext.jsx";
import TrendLineChart from "../components/charts/TrendLineChart.jsx";
import DTIRadarChart from "../components/charts/DTIRadarChart.jsx";
// 1. IMPORT COMPONENT MỚI
import DVCBarChart from "../components/charts/DVCBarChart.jsx";

const glassmorphismStyle = (borderRadiusLG) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  borderRadius: borderRadiusLG,
});

const DetailPage = () => {
  const { provinceName } = useParams();
  const { masterData, isLoading } = useData();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { provinceDataOverTime, latestData } = useMemo(() => {
    if (!masterData || masterData.length === 0) {
      return { provinceDataOverTime: [], latestData: null };
    }
    const data = masterData
      .filter((p) => p.TinhThanh === provinceName)
      .sort((a, b) => a.Nam - b.Nam);
    const latest = data[data.length - 1];
    return { provinceDataOverTime: data, latestData: latest };
  }, [masterData, provinceName]);

  if (isLoading || !latestData) {
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
          tip={`Đang tải dữ liệu chi tiết cho ${provinceName}...`}
          size="large"
        />
      </div>
    );
  }

  // 2. CẬP NHẬT TAB 2
  const breakdownItems = [
    {
      key: "1",
      label: "Tab 1: Phân rã DTI",
      children: <DTIRadarChart latestData={latestData} />,
    },
    {
      key: "2",
      label: "Tab 2: Phân rã Dịch vụ công",
      // Thay thế "Sắp có..." bằng component mới
      children: <DVCBarChart latestData={latestData} />,
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

      <h1>Chi tiết: TỈNH {provinceName}</h1>

      {/* 5 Thẻ KPI */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={5}>
          <Card
            bordered={false}
            style={glassmorphismStyle(borderRadiusLG)}
            className="dashboard-card"
          >
            <Statistic
              title="DTI Tổng (Năm 2024)"
              value={latestData.DTI_Tong.toFixed(2)}
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
              title="GRDP/người"
              value={latestData.GRDP_BinhQuan}
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
            {/* (Vẫn đang dùng HaTangSo làm dữ liệu tạm) */}
            <Statistic
              title="Điểm DVC (Tạm)"
              value={latestData.HaTangSo.toFixed(2)}
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
            <Statistic title="Dân số" value={latestData.DanSo} suffix="nghìn" />
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
              value={latestData.TyLeThanhThi}
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
            <TrendLineChart provinceData={provinceDataOverTime} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Biểu đồ Phân rã (Năm 2024)"
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
