# API_Controller.py

import pandas as pd
from fastapi import FastAPI
import re
import unicodedata
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

df = pd.read_csv("../HuanLuyenMoHinh/master_data_cleaned_merged.csv")


def normalize_text(text: str):
    text = str(text).lower()
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")  # remove accents
    # convert đ -> d
    text = text.replace("đ", "d")
    text = text.replace("-", " ")
    text = re.sub(r"tp\.?\s*", "", text)  # remove TP. / TP
    text = re.sub(r"[^a-z0-9 ]", "", text)  # remove punctuation
    text = re.sub(r"\s+", " ", text).strip()
    return text

@app.get("/data-all")
def get_all_data():
    return df.to_dict(orient="records")

@app.get("/data/year/{year}")
def get_by_year(year: int):
    df["Nam"] = df["Nam"].astype(str).str.strip().astype(int)
    result = df[df["Nam"] == year]
    return result.to_dict(orient="records")

@app.get("/data/province/{province}")
def get_province(province: str):
    prov_norm = normalize_text(province)

    # Chuẩn hóa cột tỉnh thành (tạo cột cache để không xử lý lại quá nhiều lần)
    if "TinhThanh_norm" not in df.columns:
        df["TinhThanh_norm"] = df["TinhThanh"].apply(normalize_text)

    result = df[df["TinhThanh_norm"] == prov_norm]
    return result.to_dict(orient="records")

# ------------Predict------------
# Load model & scaler
scaler = joblib.load("../HuanLuyenMoHinh/features_scaler.joblib")
model = joblib.load("../HuanLuyenMoHinh/random_forest_model.joblib")

# Schema cho request body
class DTIInput(BaseModel):
    HaTangSo: float
    DanSo: float
    GRDP_BinhQuan: float
    TyLeThanhThi: float
    CongKhaiMinhBach: float
    TienDoGiaiQuyet: float
    DichVuTrucTuyen: float
    MucDoHaiLong: float
    SoHoaHoSo: float

@app.post("/predict-dti")
def predict_dti(data: DTIInput):
    # Chuyển về numpy array (shape 1 x 9)
    features = np.array([[
        data.HaTangSo,
        data.DanSo,
        data.GRDP_BinhQuan,
        data.TyLeThanhThi,
        data.CongKhaiMinhBach,
        data.TienDoGiaiQuyet,
        data.DichVuTrucTuyen,
        data.MucDoHaiLong,
        data.SoHoaHoSo
    ]])

    # Bước 1: Chuẩn hoá
    scaled_features = scaler.transform(features)

    # Bước 2: Dự đoán
    prediction = model.predict(scaled_features)[0]

    return {"DTI_Predicted": float(prediction)}

print(">>> LOADED API FILE SUCCESSFULLY <<<")