import sqlite3
import pandas as pd

conn = sqlite3.connect("data_dti.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS chuyendoiso (
    TinhThanh TEXT,
    DTI_Tong REAL,
    DTI_ChinhQuyenSo REAL,
    DTI_KinhTeSo REAL,
    DTI_XaHoiSo REAL,
    HaTangSo REAL,
    Nam INTEGER
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS ktxh (
    TenTinh TEXT,
    Nam INTEGER,
    DanSo REAL,
    DanSoThanhThi REAL,
    GrdpBinhQuan REAL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS dichvucong (
    TinhThanh TEXT,
    TongDiem_DVC REAL,
    CongKhaiMinhBach REAL,
    TienDoGiaiQuyet REAL,
    DichVuTrucTuyen REAL,
    MucDoHaiLong REAL,
    SoHoaHoSo REAL,
    Nam INTEGER
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS tonghop (
    TinhThanh TEXT,
    DTI_Tong REAL,
    DTI_ChinhQuyenSo REAL,
    DTI_KinhTeSo REAL,
    DTI_XaHoiSo REAL,
    HaTangSo REAL,
    Nam INTEGER,
    DanSo REAL,
    GRDP_BinhQuan REAL,
    TyLeThanhThi REAL,
    TongDiem_DVC REAL,
    CongKhaiMinhBach REAL,
    TienDoGiaiQuyet REAL,
    DichVuTrucTuyen REAL,
    MucDoHaiLong REAL,
    SoHoaHoSo REAL
)
""")

conn.commit()
print("Tạo bảng SQLite thành công!")


