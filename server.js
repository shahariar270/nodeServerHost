const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

let products = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
]

const server = http.createServer((req, res) => {
    // API to get data
    if (req.method === 'GET' && req.url === '/data') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return
    }

    if (req.method === 'GET' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2]);
        const singleData = products.find(item => item.id === id);
        if (singleData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(singleData));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Data not found' }));
        }
        return;
    }
    //need to rnd about POST API
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newProduct = JSON.parse(body);
                newProduct.id = products.length + 1;
                products = [newProduct, ...products];

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newProduct));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
            }
        });
        return;
    }

    //delete endpoint
    if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2]);
        const index = products.some(item => item.id === id);

        if (index) {
            products = products.filter(p => p.id !== id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Deleted successfully', id }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item not found' }));
        }
        return;
    }
    let filePath = ''

    if (req.url === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (req.url === '/about') {
        filePath = path.join(__dirname, 'public', 'about.html');
    } else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'public', 'contact.html');
    } else {
        filePath = path.join(__dirname, 'public', req.url);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
        } else {
            console.log(data);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });


});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})
