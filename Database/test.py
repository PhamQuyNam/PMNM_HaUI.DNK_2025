import sqlite3
import pandas as pd
conn = sqlite3.connect("data_dti.db")
df = pd.read_sql_query("SELECT * FROM chuyendoiso WHERE Nam=2022", conn)
print(df.head())