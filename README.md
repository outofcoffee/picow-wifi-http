# Pico W - Wi-Fi and HTTP request example

A project for [Raspberry Pi Pico W](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html) to:

- connect to Wi-Fi
- send HTTP request to server
- receive response, decode it and print it

## Prerequisites

Follow installation instructions for [Kaluma.js](https://kalumajs.org).

Flash the Pico W with the [Kaluma firmware](https://kalumajs.org/docs/getting-started#install-firmware).

## Install dependencies

```bash
npm ci
```

## Configure Wi-Fi

To connect to Wi-Fi, you need to create a `wifi.json` file in the project's root directory.

Copy `wifi.json.example` to `wifi.json` and edit it to match your Wi-Fi network settings.

## Run it

> **Note**
> Ensure your Pico W is connected to your computer via USB and you have flashed the Kaluma firmware.

Bundle the code and flash it to the Pico W:

```bash
npm start
```

The program will connect to Wi-Fi, send an HTTP request to server, receive response, print response, and then exit.

To exit the remote shell, press `Ctrl + z`.

### Flash and bundle manually

```bash
kaluma flash ./index.js --bundle --shell
```
