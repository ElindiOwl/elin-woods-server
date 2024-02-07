const http = require("http");
const fs = require('fs');
const cors = require("cors");
const server = http.createServer((request, response) => {
    cors()(request, response, () => {
        if (request.method === 'POST' && request.url === '/api') {
            let data = '';

            request.on('data', chunk => {
                data += chunk;
            });

            request.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    saveDataToDb(jsonData);
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({success: true, data: jsonData}));
                } catch (error) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({success: false, error: 'Invalid JSON'}));
                }
            });
        } else {
            response.writeHead(400, { 'Content-Type': 'text/plain' });
            response.end('Not Found');
        }
    })
});

function saveDataToDb(data) {
    let currentData = [];
    try {
        currentData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    } catch (error) {
        console.error('Ошибка при чтении файла db.json', error);
    }
    currentData.push(data);
    fs.writeFileSync('db.json', JSON.stringify(currentData, null, 2), 'utf-8');
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
