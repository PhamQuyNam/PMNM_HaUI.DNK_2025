import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "antd/dist/reset.css";
import "leaflet/dist/leaflet.css";

import { ConfigProvider } from "antd";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. IMPORT CÁC TRANG (PAGES)
import OverviewPage from "./pages/OverviewPage.jsx";
import SimulationPage from "./pages/SimulationPage.jsx";
// 2. SỬA LỖI PATH Ở ĐÂY: từ './pages.DetailPage.jsx' -> './pages/DetailPage.jsx'
import DetailPage from "./pages/DetailPage.jsx";

// 3. IMPORT "KHO DỮ LIỆU"
import { DataProvider } from "./contexts/DataContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <OverviewPage /> },
      { path: "simulation", element: <SimulationPage /> },
      { path: "province/:provinceName", element: <DetailPage /> },
    ],
  },
]);

// 4. CHẠY APP DÙNG <ROUTERPROVIDER>
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
        },
      }}
    >
      {/* Cung cấp các routes cho App */}
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </ConfigProvider>
  </React.StrictMode>
);
