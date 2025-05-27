from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# Load DB config from environment variables, with defaults as fallback
DB_NAME = os.getenv('DB_NAME', 'goalpara')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Kinshuk2214')
DB_HOST = os.getenv('DB_HOST', 'localhost')      # Change to your remote DB host
DB_PORT = os.getenv('DB_PORT', '5432')

def get_data(page, page_size, meter_id=None):
    offset = (page - 1) * page_size

    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()

    if meter_id:
        meter_id = meter_id.strip()
        query = "SELECT * FROM block_wise_qos_template WHERE meter_id = %s LIMIT %s OFFSET %s"
        cursor.execute(query, (meter_id, page_size, offset))
    else:
        query = "SELECT * FROM block_wise_qos_template LIMIT %s OFFSET %s"
        cursor.execute(query, (page_size, offset))

    rows = cursor.fetchall()
    colnames = [desc[0] for desc in cursor.description]
    conn.close()

    result = [dict(zip(colnames, row)) for row in rows]
    return result

@app.route('/data', methods=['GET'])
def fetch_data():
    try:
        page = int(request.args.get('page', 1))
        page_size = int(request.args.get('page_size', 1000))
        meter_id = request.args.get('meter_id')

        data = get_data(page, page_size, meter_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Listen on all interfaces so you can test from other machines if needed
    app.run(host='0.0.0.0', port=5000, debug=True)
