from flask import Flask, jsonify
from sensor_simulator import SensorSimulator
import threading
import time
import requests
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurações atualizadas
THINGSPEAK_API_KEY = '71RCOO6OUVOLMTMD'
THINGSPEAK_URL = 'https://api.thingspeak.com/update'
DB_CONFIG = {
    'host': 'atividade-mysql',
    'port': 3307,  # Adicione esta linha
    'user': 'root',
    'password': '123456',
    'database': 'sensor_data'
}

sensor_simulator = SensorSimulator()

def send_to_thingspeak():
    while True:
        data = sensor_simulator.get_sensor_data()
        try:
            params = {
                'api_key': THINGSPEAK_API_KEY,
                'field1': data['temperatura'],
                'field2': data['umidade'],
                'field3': data['presenca']
            }
            response = requests.get(THINGSPEAK_URL, params=params)
            print(f"Dados enviados para ThingSpeak. Status: {response.status_code}")
            
            # Persistir no banco de dados
            persist_data(data)
        except Exception as e:
            print(f"Erro ao enviar para ThingSpeak: {e}")
        time.sleep(15)

def persist_data(data):
    try:
        connection = pymysql.connect(**DB_CONFIG)
        with connection.cursor() as cursor:
            sql = """INSERT INTO sensor_readings 
                     (temperature, humidity, presence, voltage) 
                     VALUES (%s, %s, %s, %s)"""
            cursor.execute(sql, (
                data['temperatura'], 
                data['umidade'], 
                data['presenca'], 
                data['tensao']
            ))
        connection.commit()
    except Exception as e:
        print(f"Erro ao persistir dados: {e}")
    finally:
        if connection:
            connection.close()

@app.route('/dados', methods=['GET'])
def get_data():
    data = sensor_simulator.get_sensor_data()
    return jsonify(data)

if __name__ == '__main__':
    # Inicia a thread para enviar dados para o ThingSpeak
    thingspeak_thread = threading.Thread(target=send_to_thingspeak)
    thingspeak_thread.daemon = True
    thingspeak_thread.start()
    
    app.run(host='0.0.0.0', port=5000)