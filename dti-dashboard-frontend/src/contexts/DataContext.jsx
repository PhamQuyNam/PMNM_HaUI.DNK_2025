// // src/contexts/DataContext.jsx
// import React from "react"; // Sửa: import React đầy đủ
// import { getMasterData } from "../services/api.js";

// // 1. Tạo Context
// const DataContext = React.createContext(null);

// // 2. Tạo "Nhà cung cấp" (Provider)
// export const DataProvider = ({ children }) => {
//   const [masterData, setMasterData] = React.useState([]);
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchData = async () => {
//       console.log("Đang gọi GET /api/data...");
//       const data = await getMasterData();
//       setMasterData(data);
//       setIsLoading(false);
//       console.log("Đã tải xong 102 dòng dữ liệu vào Context.");
//     };

//     fetchData();
//   }, []); // [] nghĩa là chỉ chạy 1 lần

//   return (
//     <DataContext.Provider value={{ masterData, isLoading }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// // 3. Tạo "Hook" (Móc) - ĐÃ SỬA
// // eslint-disable-next-line react-refresh/only-export-components
// export const useData = () => {
//   // Dùng React.useContext để tường minh
//   const context = React.useContext(DataContext);

//   // Thêm kiểm tra an toàn (để báo lỗi rõ hơn)
//   if (context === undefined) {
//     throw new Error("Lỗi: useData phải được dùng bên trong một DataProvider");
//   }
//   return context;
// };
// src/contexts/DataContext.jsx
import React from "react"; // Sửa: import React đầy đủ
import { getMasterData } from "../services/api.js";

// 1. Tạo Context
const DataContext = React.createContext(null);

// 2. Tạo "Nhà cung cấp" (Provider)
export const DataProvider = ({ children }) => {
  const [masterData, setMasterData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // 1. SỬA: Thêm state cho năm được chọn
  const [selectedYear, setSelectedYear] = React.useState(2024);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log("Đang gọi GET /api/data...");
      const data = await getMasterData();
      setMasterData(data);
      setIsLoading(false);
      console.log("Đã tải xong 102 dòng dữ liệu vào Context.");
    };

    fetchData();
  }, []); // [] nghĩa là chỉ chạy 1 lần

  return (
    // 2. SỬA: Thêm selectedYear và setSelectedYear vào value
    <DataContext.Provider
      value={{ masterData, isLoading, selectedYear, setSelectedYear }}
    >
      {children}
    </DataContext.Provider>
  );
};

// 3. Tạo "Hook" (Móc)
// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error("Lỗi: useData phải được dùng bên trong một DataProvider");
  }
  return context;
};
