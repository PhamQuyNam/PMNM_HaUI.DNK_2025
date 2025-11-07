import axios from "axios";

// 1. URL MỚI TỪ BACKEND
const API_URL = "http://127.0.0.1:8000";

/**
 * API 1: Lấy toàn bộ dữ liệu (Đã đổi tên)
 */
export const getMasterData = async () => {
  try {
    // 2. GỌI API THẬT (Đã đổi tên)
    console.log("Đang gọi API thật: GET /data-all");
    const response = await axios.get(`${API_URL}/data-all`);
    console.log("API thật trả về:", response.data.length, "dòng");
    return response.data; // Trả về mảng [ {TinhThanh...}, ... 102 object ]
  } catch (error) {
    console.error("LỖI KHI GỌI API /data-all:", error);
    return []; // Trả về rỗng nếu lỗi
  }
};

/**
 * API 2: Dự đoán DTI (Đã đổi tên)
 */
export const predictDTI = async (features) => {
  try {
    // 3. GỌI API THẬT (Đã đổi tên)
    console.log("Đang gọi API thật: POST /predict-dti");
    const response = await axios.post(`${API_URL}/predict-dti`, features);
    // 4. SỬA LẠI KEY TRẢ VỀ (theo code Backend)
    return { success: true, predicted_dti: response.data.DTI_Predicted };
  } catch (error) {
    console.error("LỖI KHI GỌI API /predict-dti:", error);
    return { success: false, predicted_dti: 0 };
  }
};
