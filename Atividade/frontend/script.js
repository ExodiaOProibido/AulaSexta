// Configuração dos gráficos
const tempCtx = document.getElementById('tempChart').getContext('2d');
const humidityCtx = document.getElementById('humidityChart').getContext('2d');
const voltageCtx = document.getElementById('voltageChart').getContext('2d');

const tempChart = new Chart(tempCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperatura (°C)',
            data: [],
            borderColor: 'rgba(231, 76, 60, 1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

const humidityChart = new Chart(humidityCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Umidade (%)',
            data: [],
            borderColor: 'rgba(52, 152, 219, 1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                max: 100
            }
        }
    }
});

const voltageChart = new Chart(voltageCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Tensão (V)',
            data: [],
            borderColor: 'rgba(241, 196, 15, 1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// Atualizar dados a cada 5 segundos
function updateData() {
    fetch('http://backend-service:5000/dados')
        .then(response => response.json())
        .then(data => {
            // Atualizar valores
            document.getElementById('temperature').textContent = `${data.temperatura} °C`;
            document.getElementById('humidity').textContent = `${data.umidade} %`;
            document.getElementById('presence').textContent = data.presenca ? 'Detectada' : 'Não detectada';
            document.getElementById('voltage').textContent = `${data.tensao} V`;
            
            // Atualizar indicador de presença
            const presenceIndicator = document.getElementById('presenceIndicator');
            presenceIndicator.classList.toggle('active', data.presenca === 1);
            
            // Atualizar gráficos
            updateChart(tempChart, data.temperatura);
            updateChart(humidityChart, data.umidade);
            updateChart(voltageChart, data.tensao);
            
            // Atualizar hora da última atualização
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

function updateChart(chart, newValue) {
    const now = new Date().toLocaleTimeString();
    
    // Adicionar novo dado
    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(newValue);
    
    // Manter apenas os últimos 10 pontos
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    
    chart.update();
}

// Atualizar dados imediatamente e a cada 5 segundos
updateData();
setInterval(updateData, 5000);

// Simular envio para ThingSpeak (apenas para demonstração)
setInterval(() => {
    console.log('Dados enviados para ThingSpeak');
}, 15000);