const http = require('http');
const fs = require('fs');

const loadFile = (filename) => {
    return fs.readFileSync(filename);
}

let texts = ["asd", "ccc", "ww"];

const server = http.createServer((req, res) => {
    if (req.method == 'POST') {
        console.log(req);
    }

    texts.push("SDASDasd")

    res.write(texts.join("\n"))


    res.end();
});


server.listen(3000, () => console.log("Server is running ..."))



