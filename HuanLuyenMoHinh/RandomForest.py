import pandas as pd
import numpy as np
import re
import warnings
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# --- Cài đặt Môi trường ---
# Tắt các cảnh báo không quan trọng
warnings.filterwarnings('ignore')
# Cài đặt để Pandas hiển thị tất cả các cột khi dùng print()
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)


# --- Hàm trợ giúp: Chuẩn hóa Tên tỉnh ---
def standardize_province_name(name):
    """Làm sạch và chuẩn hóa tên tỉnh về một định dạng chung."""
    name = str(name).strip()
    name = re.sub(r'^(TP\. |Tỉnh |Thành phố )', '', name)
    if 'Hồ Chí Minh' in name:
        return 'TP. Hồ Chí Minh'
    if 'Huế' in name or 'Thừa Thiên' in name:
        return 'Thừa Thiên Huế'
    if 'Bà Rịa' in name:
        return 'Bà Rịa - Vũng Tàu'
    if 'Đắk Lắk' in name:
        return 'Đắk Lắk'
    if 'Đắk Nông' in name:
        return 'Đắk Nông'
    return name


# --- Hàm chính (Main Pipeline) ---
def main():
    """Hàm chính điều phối toàn bộ quy trình huấn luyện."""

    print("=" * 60)
    print("BẮT ĐẦU QUY TRÌNH HUẤN LUYỆN MÔ HÌNH RANDOM FOREST")
    print("=" * 60)

    # --- Bước 1: Tải Dữ liệu ---
    print("Bước 1: Đang tải 3 file CSV...")
    try:
        # Giả định file CSV nằm cùng thư mục hoặc bạn có thể
        # thay bằng đường dẫn tuyệt đối (nhớ thêm 'r' ở trước)
        # Ví dụ: df1 = pd.read_csv(r"C:\Users\Acer\Desktop\PMNM\Tapdulieu\bang_1.csv")
        df1 = pd.read_csv("C:/Users/Acer/Desktop/PMNM/Tapdulieu/bang_1.csv")
        df2 = pd.read_csv("C:/Users/Acer/Desktop/PMNM/Tapdulieu/bang_2.csv")
        df3 = pd.read_csv("C:/Users/Acer/Desktop/PMNM/Tapdulieu/bang_3.csv")
        print("... Tải 3 file CSV thành công.")
    except FileNotFoundError as e:
        print(f"LỖI: Không tìm thấy file! {e}")
        print("Vui lòng đảm bảo 3 file bang_1.csv, bang_2.csv, bang_3.csv nằm cùng thư mục.")
        return  # Dừng chương trình

    # --- Bước 2 & 3: Tiền xử lý & Hợp nhất ---
    print("\nBước 2 & 3: Đang tiền xử lý, tạo đặc trưng và hợp nhất...")
    # Xử lý Bảng 2 (GSO)
    df2.rename(columns={
        'nam': 'Nam', 'dan so': 'DanSo', 'dan so thanh thi': 'DanSoThanhThi',
        'grdp_binh quan': 'GRDP_BinhQuan', 'TenTinh': 'TinhThanh'
    }, inplace=True)
    df2['TyLeThanhThi'] = (df2['DanSoThanhThi'] / df2['DanSo']) * 100
    df2 = df2.drop(columns=['DanSoThanhThi'])
    # Xử lý Bảng 3 (DVC)
    df3['TinhThanh'] = df3['TinhThanh'].str.replace(r'^(UBND tỉnh |UBND Thành phố |UBND )', '', regex=True)
    # Chuẩn hóa tên tỉnh
    df1['TinhThanh'] = df1['TinhThanh'].apply(standardize_province_name)
    df2['TinhThanh'] = df2['TinhThanh'].apply(standardize_province_name)
    df3['TinhThanh'] = df3['TinhThanh'].apply(standardize_province_name)
    # Hợp nhất (INNER JOIN)
    df_merged = pd.merge(df1, df2, on=['TinhThanh', 'Nam'], how='inner')
    master_df = pd.merge(df_merged, df3, on=['TinhThanh', 'Nam'], how='inner')
    print(f"Dữ liệu sau khi hợp nhất (INNER JOIN) có: {len(master_df)} dòng.")

    if len(master_df) == 0:
        print("LỖI: Không có dữ liệu chung sau khi hợp nhất. Dừng chương trình.")
        return

    # --- Bước 4: Chuẩn bị Đặc trưng (X) và Mục tiêu (y) ---
    print("\nBước 4: Đang xây dựng bộ đặc trưng (X) và biến mục tiêu (y)...")
    y = master_df['DTI_Tong']
    feature_columns = [
        'HaTangSo', 'DanSo', 'GRDP_BinhQuan', 'TyLeThanhThi',
        'CongKhaiMinhBach', 'TienDoGiaiQuyet', 'DichVuTrucTuyen',
        'MucDoHaiLong', 'SoHoaHoSo'
    ]
    X = master_df[feature_columns]
    # Xử lý NaN (nếu có)
    if X.isnull().sum().sum() > 0:
        print("...Phát hiện giá trị NaN, đang điền bằng giá trị trung bình...")
        for col in X.columns:
            if X[col].isnull().any():
                X[col].fillna(X[col].mean(), inplace=True)
    print(f"Đã tạo X (với {X.shape[1]} đặc trưng) và y.")

    # --- Bước 5: Chuẩn hóa (Scale) và Chia (Split) Dữ liệu ---
    print("\nBước 5: Đang chuẩn hóa (Scaling) và chia dữ liệu (Splitting)...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    print(f"Chia dữ liệu: {len(X_train)} mẫu huấn luyện, {len(X_test)} mẫu kiểm thử.")

    # --- Bước 6: Huấn luyện & Tối ưu Random Forest (GridSearchCV) ---
    print("\nBước 6: Đang huấn luyện và tối ưu Random Forest...")
    rf_model = RandomForestRegressor(random_state=42)
    param_grid = {
        'n_estimators': [50, 100, 150],  # Số lượng "cây"
        'max_depth': [5, 10, None],  # Độ sâu
        'min_samples_leaf': [1, 2, 4]  # Mẫu tối thiểu ở 1 "lá"
    }
    print("... Bắt đầu dò tìm tham số tốt nhất (GridSearchCV)...")
    # (cv=3: 3-fold cross-validation; scoring='r2': tối ưu theo R-squared)
    grid_search = GridSearchCV(estimator=rf_model, param_grid=param_grid, cv=3,
                               scoring='r2', n_jobs=-1, verbose=1)
    grid_search.fit(X_train, y_train)
    best_rf_model = grid_search.best_estimator_
    print(f"\nĐÃ TỐI ƯU XONG! Tham số tốt nhất tìm được: {grid_search.best_params_}")

    # --- Bước 7: Đánh giá Mô hình Tốt nhất ---
    print("\nBước 7: Đang đánh giá mô hình tốt nhất trên tập Test...")
    y_pred_rf = best_rf_model.predict(X_test)
    r2_rf = r2_score(y_test, y_pred_rf)
    mse_rf = mean_squared_error(y_test, y_pred_rf)
    print("\n--- KẾT QUẢ RANDOM FOREST TỐI ƯU ---")
    print(f"  R-squared (R2): {r2_rf:.4f} (tức {r2_rf:.2%})")
    print(f"  Mean Squared Error (MSE): {mse_rf:.4f}")

    # --- Bước 8: Phân tích Đặc trưng (In ra Terminal) ---
    print("\nBước 8: Phân tích mức độ quan trọng của đặc trưng...")
    rf_importances = pd.DataFrame({
        'Feature': feature_columns,
        'Importance': best_rf_model.feature_importances_
    }).sort_values(by='Importance', ascending=False)  # Sắp xếp
    print("\nBảng Mức độ Quan trọng (từ cao đến thấp):")
    # Dùng .to_string() để in ra đẹp trong terminal
    print(rf_importances.to_string())

    # --- Bước 9: Lưu Mô hình ---
    print("\nBước 9: Đang lưu các tệp kết quả...")
    model_name = "random_forest_model.joblib"
    scaler_name = "features_scaler.joblib"
    data_name = "master_data_cleaned_merged.csv"

    joblib.dump(best_rf_model, model_name)
    joblib.dump(scaler, scaler_name)
    master_df.to_csv(data_name, index=False, encoding='utf-8-sig')

    print("\n--- HOÀN TẤT ---")
    print(f"Đã lưu thành công 3 file:")
    print(f"  1. Mô hình:   {model_name}")
    print(f"  2. Scaler:    {scaler_name}")
    print(f"  3. Dữ liệu:   {data_name}")
    print("=" * 60)


# --- Điểm Bắt đầu Chạy Chương trình ---
if __name__ == "__main__":
    main()