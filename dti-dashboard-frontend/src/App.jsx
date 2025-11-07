// src/App.jsx
import React, { useState, useEffect } from "react";
import { PieChartOutlined, ExperimentOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
// 1. IMPORT THÊM "useLocation"
import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";

const { Header, Content, Footer, Sider } = Layout;

// (Hàm getItem và mảng items của bạn không đổi, tôi copy lại)
function getItem(label, key, icon, children, fullTitle) {
  return { key, icon, children, label, fullTitle };
}

const items = [
  getItem(
    <Link to="/">Dashboard</Link>,
    "1",
    <PieChartOutlined />,
    null,
    "Dashboard Tổng quan"
  ),
  getItem(
    <Link to="/simulation">Dự đoán</Link>,
    "2",
    <ExperimentOutlined />,
    null,
    "Dự đoán hiệu quả dịch vụ công trực tuyến từ dữ liệu công khai (Open Data) của Bộ TT&TT(2022-2024)" // (Tên dài của bạn)
  ),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("Dashboard Tổng quan");

  // 2. SỬ DỤNG HOOKS
  const location = useLocation(); // Lấy thông tin trang hiện tại
  // Kiểm tra xem có phải trang Chi tiết không (path bắt đầu bằng /province/)
  const isDetailPage = location.pathname.startsWith("/province/");

  const handleMenuClick = (e) => {
    const clickedItem = items.find((item) => item.key === e.key);
    if (clickedItem) {
      const title = clickedItem.fullTitle || clickedItem.label.props.children;
      setCurrentTitle(title);
    }
  };

  // (Optional: Cập nhật tiêu đề khi F5)
  useEffect(() => {
    const currentItem = items.find(
      (item) => item.label.props.to === location.pathname
    );
    if (currentItem) {
      setCurrentTitle(currentItem.fullTitle);
    }
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "sticky", top: 0, height: "100vh" }}
      >
        {/* Logo của bạn (Không đổi) */}
        <div className="logo-container">
          <img src="/Picture1.png" alt="Logo Trường" className="logo-image" />
        </div>

        {/* Menu (Không đổi) */}
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout style={{ background: "transparent" }}>
        {/* 3. ẨN HEADER KHI Ở TRANG CHI TIẾT */}
        {!isDetailPage && (
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
            <h2 style={{ margin: 0, color: "#333" }}>{currentTitle}</h2>
          </Header>
        )}

        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>

        {/* Footer (tên nhóm) của bạn sẽ quay lại */}
        <Footer style={{ textAlign: "center", background: "transparent" }}>
          Olympic Tin học 2025 ©{new Date().getFullYear()} - Phát triển bởi
          HaUI.DNK
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
