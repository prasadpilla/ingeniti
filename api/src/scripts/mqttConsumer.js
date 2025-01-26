const mqtt = require('mqtt');
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL;
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

const client = mqtt.connect(MQTT_BROKER_URL, {
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    rejectUnauthorized: true,
    reconnectPeriod: 0,
    clientId: `javascript-mqtt-client-${Math.random().toString(16).substring(2, 10)}`
});


client.on('connect', () => {
    client.subscribe(MQTT_TOPIC);
});

client.on('message', (topic, message) => {
    // message is a Buffer
    console.log('Command:', message[0] === 0x20 ? 'ON' : 'OFF');
    console.log('Sequence:', message[1]);
    // You can also see raw bytes
    console.log('Raw bytes:', message);
});
