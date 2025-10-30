const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

const server = http.createServer((req, res) => {
    let filePath = ''

    if (req.url === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
    } else if (req.url === '/about') {
        filePath = path.join(__dirname, 'public', 'about.html');
    } else if (req.url === '/contact') {
        filePath = path.join(__dirname, 'public', 'contact.html');
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
