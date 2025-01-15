const path = require('path');
const fs = require('fs');
const http = require('http');


const getTemplateFile = (filename) => fs.readFileSync(path.join(__dirname, "templates", filename));

const handleRequestBody = (request) => {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => (body += chunk));
        request.on('end', () => resolve(body));
        request.on('error', (err) => reject(err));
    });
};

const server = http.createServer(async (request, response) => {
    response.setHeader("Content-Type", "text/html")

    switch (request.url) {
        case '/':
            if (request.method === "POST") {
                let body = await handleRequestBody(request);

                console.log(body);
            }

            return response.end(getTemplateFile('index.html'))
        case '/about':
            return response.end(getTemplateFile('about.html'))
    }

    return response.end("Server is running...");

});


server.listen(3000, () => console.log("Server is running on 3000..."))