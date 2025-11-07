import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd"; // <- Xóa "theme" vì không cần nữa

// 1. IMPORT LINK VÀ OUTLET TỪ ROUTER
import { Link, Outlet } from "react-router-dom";

import "./App.css";

const { Header, Content, Footer, Sider } = Layout;

// 2. SỬA LẠI MENU ĐỂ DÙNG <LINK>
const items = [
  getItem(
    <Link to="/">Dashboard Tổng quan</Link>, // Link đến Chức năng 1
    "1",
    <PieChartOutlined />
  ),
  getItem(
    <Link to="/simulation">Mô phỏng Dự đoán</Link>, // Link đến Chức năng 3
    "2",
    <ExperimentOutlined />
  ),
];
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  // === ĐÃ XÓA 2 DÒNG LỖI (theme.useToken và glassmorphismStyle) ===

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout style={{ background: "transparent" }}>
        <Header
          style={{
            padding: "0 16px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <h2 style={{ margin: 0 }}>
            Dashboard Chuyển đổi số (Theo kế hoạch mới)
          </h2>
        </Header>

        <Content style={{ margin: "16px" }}>
          {/* "CỬA SỔ" RENDER CỦA ROUTER */}
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center", background: "transparent" }}>
          Olympic Tin học 2025 ©{new Date().getFullYear()} - Phát triển bởi [Tên
          nhóm của bạn]
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
