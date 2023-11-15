const WiFi = require('wifi').WiFi;
const http = require('http');
const { PicoCYW43 } = require('pico_cyw43');
const wifiConfig = require('./wifi.json');

const { LED } = require('led');
const led = new LED(15);

const pico_cyw43 = new PicoCYW43();

connectToNetwork(wifiConfig);

function connectToNetwork(wifiConfig) {
    console.log(`Connecting to Wi-Fi network: ${wifiConfig.ssid}`);
    setLed(true);

    const wifi = new WiFi();
    wifi.connect(wifiConfig, (err) => {
        setLed(false);

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
    setLed(true);

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

    const decoder = new TextDecoder();
    let responseContentLength = 0;
    let body = '';

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
        setLed(false);
        console.log(body);
    }

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        responseContentLength = parseInt(res.headers['content-length'], 10);

        res.on('data', (chunk) => {
            try {
                console.log(`Received ${chunk.length} bytes of data.`);
                const decoded = decoder.decode(chunk);
                body += decoded;
                // console.log(`BODY: ${chunk}`);
                checkFinished();
            } catch (e) {
                console.error(e);
            }
        });
        res.on('close', () => {
            console.log('Response closed.');
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
        res.on('error', (e) => {
            console.error('Response error.', e);
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

/**
 * @param {boolean} state
 */
function setLed(state) {
    //pico_cyw43.putGpio(0, state);
    state ? led.on() : led.off();
}
