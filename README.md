# PMNM_HaUI.DNK_2025

Đây là một ứng dụng web dashboard, xây dựng trong khuôn khổ cuộc thi Olympic Tin học 2025. Ứng dụng cho phép người dùng trực quan hóa, phân tích, và mô phỏng dự đoán Chỉ số Chuyển đổi số (DTI) của các tỉnh thành tại Việt Nam dựa trên bộ dữ liệu 34 tỉnh (2022-2024).

Dự án bao gồm một Backend (FastAPI) cung cấp API và một Frontend (React) để hiển thị.

✨ Tính năng chính

Ứng dụng được chia thành 3 chức năng chính:

🗺️ Dashboard Tổng quan:

Hiển thị bản đồ Choropleth (tô màu) 63 tỉnh, làm nổi bật 34 tỉnh có dữ liệu.

Trực quan hóa Top 10 DTI cao nhất và Top 10 DTI thấp nhất (biểu đồ cột ngang).

Hiển thị bảng dữ liệu chi tiết (có sắp xếp, lọc).

Hiển thị biểu đồ tương quan (Scatter Plot) giữa DTI và GRDP.

Tất cả component đều được lọc "động" theo năm [ 2022 | 2023 | 2024 ].

📈 Phân tích Chi tiết Tỉnh:

Hiển thị khi người dùng click vào một tỉnh.

Hiển thị các thẻ KPI chính (DTI, GDP, Dân số...).

Biểu đồ đường (Line Chart) thể hiện xu hướng của tỉnh qua 3 năm.

Biểu đồ Radar (Nhện) phân rã 4 trụ cột DTI (Chính quyền số, Kinh tế số...).

Biểu đồ cột phân rã 5 chỉ số Dịch vụ công.

🔬 Mô phỏng "What-if":

Cho phép người dùng nhập 9 đặc trưng đầu vào của mô hình Học máy.

Gọi API /predict-dti (thời gian thực) để nhận kết quả.

Hiển thị DTI dự đoán trên biểu đồ Vòng tròn (Progress Chart).

⚙️ Công nghệ sử dụng

Backend: Python, FastAPI, Pandas, Scikit-learn

Frontend: React (Vite), JavaScript, ECharts, Mapbox

📋 Yêu cầu Cài đặt

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

Python 3.10+

Node.js (LTS) (bao gồm npm)

Git

📁 Cấu trúc Thư mục (Quan trọng)

Để dự án hoạt động chính xác, các file dữ liệu, mô hình, và bản đồ phải được đặt đúng vị trí. Cấu trúc thư mục của bạn nên trông giống như sau:

[TÊN DỰ ÁN CỦA BẠN]/
├── HuanLuyenMoHinh/
│   ├── master_data_cleaned_merged.csv
│   ├── random_forest_model.joblib
│   └── features_scaler.joblib
├── Setup_API/
│   ├── API_Controller.py
│   └── requirements.txt
└── dti-dashboard-frontend/
    ├── public/
    │   └── vietnam-provinces.geojson
    └── ... (các file khác của React)


🚀 Hướng dẫn Cài đặt & Khởi chạy

Để chạy dự án này, bạn bắt buộc phải chạy cả Backend và Frontend cùng một lúc trên hai Terminal (cửa sổ dòng lệnh) riêng biệt.

1. Clone Dự án

git clone [ĐƯỜNG DẪN GIT CỦA BẠN]
cd [TÊN DỰ ÁN CỦA BẠN]


2. Cài đặt Backend (API Server)

Thực hiện trong Terminal 1.

# 1. Đi đến thư mục Backend
cd Setup_API

# 2. Tạo môi trường ảo (khuyến nghị)
python -m venv venv

# 3. Kích hoạt môi trường ảo
# Trên Windows (PowerShell/CMD):
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

# 4. Tạo file requirements.txt với nội dung sau:
# (Bạn có thể tạo file này thủ công)


Nội dung file requirements.txt:

fastapi
uvicorn[standard]
pandas
scikit-learn
fastapi-cors
numpy
joblib
pydantic


# 5. Cài đặt các thư viện
pip install -r requirements.txt

# 6. (QUAN TRỌNG) Chuẩn bị Dữ liệu & Mô hình
# Đảm bảo 3 file (master_data_cleaned_merged.csv, random_forest_model.joblib, features_scaler.joblib)
# đã nằm đúng trong thư mục ../HuanLuyenMoHinh/ như trong cấu trúc ở trên.


3. Cài đặt Frontend (React App)

Mở một Terminal 2 (để Terminal 1 chạy Backend).

# 1. Đi đến thư mục Frontend (từ thư mục gốc của dự án)
cd dti-dashboard-frontend

# 2. Cài đặt các thư viện Node.js
npm install

# 3. (QUAN TRỌNG) Chuẩn bị file Bản đồ
# Đảm bảo bạn đã đặt file bản đồ vietnam-provinces.geojson
# vào bên trong thư mục dti-dashboard-frontend/public/


4. Chạy Dự án

Bạn phải giữ cả 2 Terminal chạy song song.

Trong Terminal 1 (Backend):

# (Đảm bảo môi trường ảo đã được kích hoạt)
# Chạy server FastAPI ở cổng 8000
uvicorn API_Controller:app --reload --port 8000


Server Backend sẽ chạy tại http://127.0.0.1:8000.

Trong Terminal 2 (Frontend):

# Chạy server Vite (React)
npm run dev


Server Frontend sẽ chạy tại http://localhost:5173 (hoặc một cổng khác nếu 5173 bị chiếm).

5. Truy cập Ứng dụng

Mở trình duyệt và truy cập vào địa chỉ mà Terminal 2 cung cấp (thường là http://localhost:5173) để xem dashboard.

🧪 Kiểm tra API (Tùy chọn)

Sau khi server Backend (Terminal 1) đang chạy, bạn có thể kiểm tra các API endpoints trực tiếp:

Truy cập http://127.0.0.1:8000/docs để xem giao diện tài liệu API (Swagger UI).

Bạn có thể thử các route tại đây:

GET /data-all: Lấy toàn bộ data.

GET /data/year/{year}: Lấy data theo năm (ví dụ: 2022).

GET /data/province/{province}: Lấy data theo tỉnh (ví dụ: ha-noi).

POST /predict-dti:

Tại giao diện /docs, click vào route này.

Chọn "Try it out".

Nhập 9 giá trị đầu vào (kiểu float) vào phần Request body.

Click "Execute" để nhận kết quả dự đoán trả về.
