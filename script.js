const Stocks = ['AAPL','MSFT','GOOGL','AMZN','PYPL', 'TSLA','JPM','NVDA', 'NFLX', 'DIS'];
const stockList = document.getElementById('stock-list');
const stockNameElem = document.getElementById('stock-name');
const stockBookValueElem = document.getElementById('stock-bookValue');
const stockProfitElem = document.getElementById('stock-profit');
const stockSummaryElem = document.getElementById('stock-summary');
let chart;

// Initialize the app
function init() {
    populateStockList();
    setupChart();
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('click', updateChartRange);
    });
}

// Populate the stock list
function populateStockList() {
    Stocks.forEach(stock => {
        const li = document.createElement('li');
        li.textContent = stock;
        li.addEventListener('click', () => selectStock(stock));
        stockList.appendChild(li);
    });
}

// Fetch stock data and update chart
function selectStock(stock) {
    fetch(`https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata?stock=${stock}&range=1month`)
        .then(response => response.json())
        .then(data => updateChart(data));

    fetch(`https://stocksapi-uhe1.onrender.com/api/stocks/getstocksprofiledata?stock=${stock}`)
        .then(response => response.json())
        .then(data => updateStockDetails(data));

    fetch(`https://stocksapi-uhe1.onrender.com/api/stocks/getstockstatsdata?stock=${stock}`)
        .then(response => response.json())
        .then(data => updateStockSummary(data));
}

// Update chart with new data
function updateChart(data) {
    const labels = data.map(item => new Date(item.timestamp * 1000).toLocaleDateString());
    const prices = data.map(item => item.price);

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(document.getElementById('stock-chart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: prices,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });
}

// Update stock details section
function updateStockDetails(data) {
    stockNameElem.textContent = `Name: ${data.name}`;
    stockBookValueElem.textContent = `Book Value: ${data.bookValue}`;
    stockProfitElem.textContent = `Profit: ${data.profit}`;
    stockProfitElem.classList.toggle('negative', data.profit < 0);
}

// Update stock summary section
function updateStockSummary(data) {
    stockSummaryElem.textContent = `Summary: ${data.summary}`;
}

// Change chart range
function updateChartRange(event) {
    const range = event.target.getAttribute('data-range');
    const selectedStock = document.querySelector('#stock-list li.active');
    if (selectedStock) {
        const stock = selectedStock.textContent;
        fetch(`https://stocksapi-uhe1.onrender.com/api/stocks/getstocksdata?stock=${stock}&range=${range}`)
            .then(response => response.json())
            .then(data => updateChart(data));
    }
}

// Setup initial chart with empty data
function setupChart() {
    chart = new Chart(document.getElementById('stock-chart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Stock Price',
                data: [],
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    display: true
                },
                y: {
                    display: true
                }
            }
        }
    });
}

init();
