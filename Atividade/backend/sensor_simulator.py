import random
import time

class SensorSimulator:
    def __init__(self):
        self.temperatura = 25.0
        self.umidade = 50.0
        self.presenca = False
        self.tensao = 220.0
        
    def get_sensor_data(self):
        # Simula variações nos valores dos sensores
        self.temperatura += random.uniform(-0.5, 0.5)
        self.umidade += random.uniform(-2, 2)
        self.umidade = max(0, min(100, self.umidade))
        
        # Presença muda aleatoriamente, mas com menos frequência
        if random.random() < 0.1:
            self.presenca = not self.presenca
            
        # Tensão com pequenas variações
        self.tensao += random.uniform(-1, 1)
        
        return {
            'temperatura': round(self.temperatura, 2),
            'umidade': round(self.umidade, 2),
            'presenca': 1 if self.presenca else 0,
            'tensao': round(self.tensao, 2)
        }