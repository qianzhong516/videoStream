const express = require("express");
const fs = require('fs');

const app = express();
const PORT = 8080;

app.get('/video', (req, res) => {
    const videoPath = __dirname + '/sample.mp4';
    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if(!range) {
        res.status(400).send('Requires Range header');
    }

    console.log({range})
    const chunkSize = 10 ** 6; // 1MB
    let start = Number(range.replace(/\D/g, "")); // E.g, bytes=123456-
    end = Math.min(videoSize - 1, start + chunkSize); // bytes are indexed. The last byte is `size-1`
    console.log({start}, {end}, {videoSize});

    let headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Content-Length': end - start + 1,
        'Accept-Ranges': "bytes",
        'Content-Type': "video/mp4"
    };
    res.writeHead(206, headers);

    let videoStream = fs.createReadStream(videoPath, {start, end});
    videoStream.pipe(res);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`listen to ${PORT}...`);
});