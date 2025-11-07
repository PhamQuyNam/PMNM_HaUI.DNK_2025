// import React, { useState } from "react";
// import {
//   DesktopOutlined,
//   PieChartOutlined,
//   ExperimentOutlined,
// } from "@ant-design/icons";
// import { Layout, Menu } from "antd"; // <- Xóa "theme" vì không cần nữa

// // 1. IMPORT LINK VÀ OUTLET TỪ ROUTER
// import { Link, Outlet } from "react-router-dom";

// import "./App.css";

// const { Header, Content, Footer, Sider } = Layout;

// // 2. SỬA LẠI MENU ĐỂ DÙNG <LINK>
// const items = [
//   getItem(
//     <Link to="/">Dashboard Tổng quan</Link>, // Link đến Chức năng 1
//     "1",
//     <PieChartOutlined />
//   ),
//   getItem(
//     <Link to="/simulation">Mô phỏng Dự đoán</Link>, // Link đến Chức năng 3
//     "2",
//     <ExperimentOutlined />
//   ),
// ];
// function getItem(label, key, icon, children) {
//   return { key, icon, children, label };
// }

// const App = () => {
//   const [collapsed, setCollapsed] = useState(false);

//   // === ĐÃ XÓA 2 DÒNG LỖI (theme.useToken và glassmorphismStyle) ===

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(value) => setCollapsed(value)}
//         style={{ position: "sticky", top: 0, height: "100vh" }}
//       >
//         <Menu
//           theme="dark"
//           defaultSelectedKeys={["1"]}
//           mode="inline"
//           items={items}
//         />
//       </Sider>

//       <Layout style={{ background: "transparent" }}>
//         <Header
//           style={{
//             padding: "0 16px",
//             background: "rgba(255, 255, 255, 0.1)",
//             backdropFilter: "blur(10px)",
//             position: "sticky",
//             top: 0,
//             zIndex: 1,
//           }}
//         >
//           <h2 style={{ margin: 0 }}>Dashboard Tổng Quan</h2>
//         </Header>

//         <Content style={{ margin: "16px" }}>
//           {/* "CỬA SỔ" RENDER CỦA ROUTER */}
//           <Outlet />
//         </Content>

//         <Footer style={{ textAlign: "center", background: "transparent" }}>
//           Olympic Tin học 2025 ©{new Date().getFullYear()} - Phát triển bởi
//           HaUI.DNK
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// };
// export default App;
import React, { useState } from "react";
import {
  DesktopOutlined, // (Bạn import nhưng chưa dùng, có thể xóa)
  PieChartOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import "./App.css"; // Chúng ta sẽ dùng file này để thêm logo

const { Header, Content, Footer, Sider } = Layout;

// Định nghĩa menu
const items = [
  getItem(<Link to="/">Dashboard Tổng quan</Link>, "1", <PieChartOutlined />),
  getItem(
    <Link to="/simulation">Mô phỏng Dự đoán</Link>,
    "2",
    <ExperimentOutlined />
  ),
];
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  // 1. DÙNG STATE ĐỂ LƯU TIÊU ĐỀ HEADER
  const [currentTitle, setCurrentTitle] = useState("Dashboard Tổng quan");

  // 2. HÀM CẬP NHẬT TIÊU ĐỀ KHI BẤM MENU
  const handleMenuClick = (e) => {
    // Tìm item được click dựa trên key
    const clickedItem = items.find((item) => item.key === e.key);
    if (clickedItem) {
      // Lấy nội dung text bên trong <Link>...</Link>
      setCurrentTitle(clickedItem.label.props.children);
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
        {/* 3. THAY KHỐI XÁM BẰNG LOGO TEXT */}
        <div className="logo-container">
          <img
            src="/Picture1.png" // <-- Ghi tên file logo của bạn ở đây
            alt="Logo Trường"
            className="logo-image" // Chúng ta sẽ dùng class này để chỉnh CSS
          />
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick} // <-- Thêm sự kiện onClick
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
          {/* 4. HIỂN THỊ TIÊU ĐỀ ĐỘNG */}
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
