import requests
import pandas as pd
import json
import time

# 1. Danh sách các năm chúng ta cần thu thập
years_to_fetch = [2022, 2023, 2024]

# 2. Thông tin API (DÙNG PARAMS MỚI BẠN VỪA TÌM THẤY)
api_url = "https://dichvucong.gov.vn/jsp/rest.jsp"

# 3. Headers (không đổi)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    "Referer": "https://dichvucong.gov.vn/p/home/dvc-index-tinhthanhpho-tonghop.html",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://dichvucong.gov.vn"
}

# 4. Chuẩn bị một danh sách để gom tất cả DataFrame
all_dataframes = []

print("Bắt đầu quá trình thu thập dữ liệu Bảng 3 (DÙNG API CHI TIẾT)...")
for year in years_to_fetch:
    print(f"\n--- Đang lấy dữ liệu chi tiết cho năm: {year} ---")

    # 5. Tạo Payload động (DÙNG PARAMS MỚI)
    params_dict = {
        "type": "ref",
        "p_nam": str(year),  # <-- Thay đổi năm
        "p_6thang": 0,
        "p_tinh_id": "0",
        "p_huyen_id": "0",  # Thêm key này (dù trong params của bạn không có, nhưng để cho chắc)
        "pageIndex": 1,
        "pageSize": 1000,
        "p_loaidonvi": 1,
        "loaichitieu": 0,
        "service": "report_tinh_766_service",  # <-- Dùng service MỚI
        "p_default": 0,  # Thêm key này
        "p_xa_id": "0",  # Thêm key này
        "p_quy": 0,
        "p_thang": 0
    }

    # Chuyển dict thành chuỗi JSON, sau đó gán vào payload
    payload_data = {"params": json.dumps(params_dict)}

    # 6. Gửi yêu cầu POST
    try:
        response = requests.post(api_url, data=payload_data, headers=headers, timeout=10)

        if response.status_code == 200:
            print(f"Gọi API năm {year} thành công!")

            raw_data = response.json()
            if not raw_data:
                print(f"Không có dữ liệu trả về cho năm {year}.")
                continue

                # === KHỐI LỆNH DEBUG ===
            # In ra 2 phần tử đầu tiên của dữ liệu thô để xác nhận tên cột
            print(f"--- DỮ LIỆU THÔ TỪ API NĂM {year} (2 PHẦN TỬ ĐẦU) ---")
            print(json.dumps(raw_data[:2], indent=2, ensure_ascii=False))
            print("--------------------------------------------------")

            df = pd.DataFrame(raw_data)

            # 7. (RẤT QUAN TRỌNG) Làm sạch và đổi tên cột
            # Đây là các tên cột chúng ta dự đoán từ ảnh F12 gốc của bạn
            # (Nếu script này lỗi KeyError, chúng ta sẽ xem DỮ LIỆU THÔ ở trên
            #  và sửa lại các key này cho đúng)
            column_mapping = {
                "TEN": "TinhThanh",
                "TONG_SCORE": "TongDiem_DVC",
                "CKMB": "CongKhaiMinhBach",
                "TDGQ": "TienDoGiaiQuyet",
                "MDHL": "MucDoHaiLong",
                "MDSH": "SoHoaHoSo"
            }
            df = df.rename(columns=column_mapping)

            # 8. Xử lý cột 'DichVuTrucTuyen'
            if 'CLGQ' in df.columns and 'TTTT' in df.columns:
                print(f"Phát hiện cột CLGQ và TTTT cho năm {year}.")
                df['CLGQ'] = pd.to_numeric(df['CLGQ'], errors='coerce')
                df['TTTT'] = pd.to_numeric(df['TTTT'], errors='coerce')
                df['DichVuTrucTuyen'] = df['CLGQ'] + df['TTTT']
            else:
                print(f"Cảnh báo: Không tìm thấy cột CLGQ/TTTT cho năm {year}.")
                df['DichVuTrucTuyen'] = pd.NA

                # 9. Chọn các cột cuối cùng chúng ta cần
            final_columns = [
                "TinhThanh",
                "TongDiem_DVC",
                "CongKhaiMinhBach",
                "TienDoGiaiQuyet",
                "DichVuTrucTuyen",
                "MucDoHaiLong",
                "SoHoaHoSo"
            ]

            final_columns_exist = [col for col in final_columns if col in df.columns]
            final_df = df[final_columns_exist].copy()

            final_df['Nam'] = year

            all_dataframes.append(final_df)
            print(f"Đã xử lý xong dữ liệu năm {year}.")

        else:
            print(f"Lỗi khi lấy dữ liệu năm {year}! Mã trạng thái: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"Lỗi kết nối khi lấy dữ liệu năm {year}: {e}")

    print("Tạm dừng 2 giây...")
    time.sleep(2)

# 10. Gộp tất cả dữ liệu lại
if all_dataframes:
    print("\nĐang gộp dữ liệu các năm lại...")
    master_df = pd.concat(all_dataframes, ignore_index=True)

    output_file = "bang_3_CHI_TIET_ALL_YEARS_clean.csv"
    master_df.to_csv(output_file, index=False, encoding='utf-8-sig')

    print(f"\nĐÃ THU THẬP XONG BẢNG 3 (CHI TIẾT).")
    print(f"Đã lưu dữ liệu tổng (2022-2024) vào file: '{output_file}'")
    print("\nCấu trúc bảng dữ liệu tổng:")
    print(master_df.info())
else:
    print("\nKhông thu thập được dữ liệu nào.")