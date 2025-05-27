import pandas as pd
import psycopg2
from datetime import datetime

# Load Excel data
df = pd.read_excel(r"C:\Users\KinshukGoswami\OneDrive - Sinhal Udyog pvt ltd\Desktop\CT-LS.xlsx")

# Convert Time column to datetime
df['Time'] = pd.to_datetime(df['Time'])

# Extract date and calculate block (30-min interval → 48 blocks/day)
df['date'] = df['Time'].dt.date
df['block'] = df['Time'].dt.hour * 2 + df['Time'].dt.minute // 30 + 1

# Rename for clarity
df.rename(columns={
    'Meter_id': 'meter_id',
    'Rcurrent': 'Ir',
    'Ycurrent': 'Iy',
    'Bcurrent': 'Ib',
    'Rvoltage': 'Vr',
    'Yvoltage': 'Vy',
    'Bvoltage': 'Vb',
    'Rpowerfac': 'PFr',
    'Ypowerfac': 'PFy',
    'Bpowerfac': 'PFb'
}, inplace=True)

# Compute derived metrics
df['pfavg3ph'] = df[['PFr', 'PFy', 'PFb']].mean(axis=1)
df['v3ph_avg'] = df[['Vr', 'Vy', 'Vb']].mean(axis=1)
df['v3ph_max'] = 0

nominal_voltage = 240
# Voltage variation with average
df['v3ph_avg_percent'] = ((df['v3ph_avg'] - nominal_voltage)/nominal_voltage) * 100
df['va_avg_percent'] = ((df['Vr'] - nominal_voltage) / nominal_voltage) * 100
df['vb_avg_percent'] = ((df['Vy'] - nominal_voltage) / nominal_voltage) * 100
df['vc_avg_percent'] = ((df['Vb'] - nominal_voltage) / nominal_voltage) * 100

# Voltage variation with max
df['va_max_percent'] = 0
df['vb_max_percent'] = 0
df['vc_max_percent'] = 0

df['va_dev'] = ((df["Vr"] - df["v3ph_avg"])/df["v3ph_avg"])*100
df['vb_dev'] = ((df["Vy"] - df["v3ph_avg"])/df["v3ph_avg"])*100
df['vc_dev'] = ((df["Vb"] - df["v3ph_avg"])/df["v3ph_avg"])*100
# Voltage Unbalance (max deviation from avg as % of avg)
df['vu_percent'] = df[['va_dev', 'vb_dev','vc_dev']].abs().max(axis=1)

# Current Unbalance
df['iu_percent'] = df[['Ir', 'Iy', 'Ib']].apply(
    lambda row: max(abs((row - row.mean()) / row.mean()) * 100) if row.mean() != 0 else 0,
    axis=1
)


# Prepare subset for DB insert
final_df = df[[
    'date', 'block', 'pfavg3ph', 'PFr', 'PFy', 'PFb',
    'v3ph_avg_percent', 'va_avg_percent', 'vb_avg_percent', 'vc_avg_percent',
    'v3ph_max', 'va_max_percent', 'vb_max_percent', 'vc_max_percent',
    'vu_percent', 'iu_percent', 'meter_id'
]]

# Connect to PostgreSQL
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="goalpara",
    user="postgres",
    password="Kinshuk2214"
)
cur = conn.cursor()

# Insert data
insert_query = """
INSERT INTO block_wise_qos_template(
    date, block, pfavg3ph, pfph_a, pfph_b, pfph_c,
    v3ph_avg_percent, va_avg_percent, vb_avg_percent, vc_avg_percent,
    v3ph_max_percent, va_max_percent, vb_max_percent, vc_max_percent,
    vu_percent, iu_percent, meter_id
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Insert all rows
for _, row in final_df.iterrows():
    cur.execute(insert_query, tuple(row))

conn.commit()
cur.close()
conn.close()

print("Data inserted successfully.")
