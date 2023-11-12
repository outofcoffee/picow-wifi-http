const WiFi = require('wifi').WiFi;
const http = require('http');
const { PicoCYW43 } = require('pico_cyw43');
const Buffer = require('buffer/').Buffer
const wifiConfig = require('./wifi.json');

const pico_cyw43 = new PicoCYW43();

connectToNetwork(wifiConfig);

function connectToNetwork(wifiConfig) {
    console.log(`Connecting to Wi-Fi network: ${wifiConfig.ssid}`);
    pico_cyw43.putGpio(0, true);

    const wifi = new WiFi();
    wifi.connect(wifiConfig, (err) => {
        pico_cyw43.putGpio(0, false);

        if (err) {
            console.error(err);
        } else {
            console.log('Connected to Wi-Fi');
            sendRequest();
        }
    });
}

function sendRequest() {
    console.log('Sending request');
    pico_cyw43.putGpio(0, true);

    const host = 'example.com';
    const port = 80;

    const options = {
        host,
        port,
        path: '/',
        method: 'GET',
        headers: {
            'Host': host,
        }
    };

    let responseContentLength = 0;
    let body = [];

    const checkFinished = () => {
        let percent = 0;
        if (responseContentLength > 0) {
            percent = Math.round(body.length / responseContentLength * 100);
        }
        console.log(`Body length: ${body.length} / ${responseContentLength} (${percent}%)`);
        if (body.length < responseContentLength) {
            return;
        }
        console.log('Response finished');
        pico_cyw43.putGpio(0, false);

        const buf = Buffer.from(body);
        console.log(buf.toString());
    }

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        responseContentLength = parseInt(res.headers['content-length'], 10);

        res.on('data', (chunk) => {
            console.log(`Received ${chunk.length} bytes of data.`);
            body.push(...chunk);
            //console.log(`BODY: ${chunk}`);
            checkFinished();
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.on('response', (res) => {
        console.log(`response event: ${res.statusCode} ${res.statusMessage}`);
    });

    // Finish the request
    req.end();

    console.log('Request sent');
}