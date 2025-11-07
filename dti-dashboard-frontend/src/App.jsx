import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import "./App.css";

const { Header, Content, Footer, Sider } = Layout;

// 1. SỬA HÀM getItem (Thêm 'fullTitle' ở cuối)
function getItem(label, key, icon, children, fullTitle) {
  return { key, icon, children, label, fullTitle };
}

// 2. SỬA MẢNG 'items'
const items = [
  getItem(
    <Link to="/">Dashboard</Link>, // label (Sider)
    "1", // key
    <PieChartOutlined />, // icon
    null, // children
    "Dashboard Tổng quan" // fullTitle (Header)
  ),
  getItem(
    <Link to="/simulation">Dự đoán</Link>, // label (SIDER) - ĐÃ RÚT GỌN
    "2", // key
    <ExperimentOutlined />, // icon
    null, // children
    // fullTitle (HEADER) - Text dài của bạn:
    "Dự đoán hiệu quả dịch vụ công trực tuyến từ dữ liệu công khai (Open Data) của Bộ TT&TT(2022-2024)"
  ),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  // State này sẽ lấy từ 'fullTitle'
  const [currentTitle, setCurrentTitle] = useState("Dashboard Tổng quan");

  // 3. SỬA HÀM handleMenuClick
  const handleMenuClick = (e) => {
    const clickedItem = items.find((item) => item.key === e.key);
    if (clickedItem) {
      // Ưu tiên lấy 'fullTitle', nếu không có thì lấy text của label
      const title = clickedItem.fullTitle || clickedItem.label.props.children;
      setCurrentTitle(title);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* Logo của bạn (Giữ nguyên) */}
        <div className="logo-container">
          <img src="/Picture1.png" alt="Logo Trường" className="logo-image" />
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items} // <-- Dùng 'items' đã rút gọn
          onClick={handleMenuClick} // <-- Dùng hàm click đã sửa
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
          {/* Header này giờ sẽ hiển thị 'fullTitle' */}
          <h2 style={{ margin: 0, color: "#333" }}>{currentTitle}</h2>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center", background: "transparent" }}>
          Olympic Tin học 2025 ©{new Date().getFullYear()} - Phát triển bởi
          HaUI.DNK
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
