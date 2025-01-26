import { MqttClient } from 'mqtt';
import * as mqtt from 'mqtt';
import { Logger } from 'pino';
import { MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD } from '../config';
import { getDevice, updateDevice } from '../models/devices.model';

export class MQTTConnector {
    private client: MqttClient | null = null;
    private static instance: MQTTConnector;
    private logger: Logger;

    private constructor(logger: Logger) {
        this.logger = logger.child({ module: 'MQTTConnector' });
    }

    static getInstance(logger: Logger): MQTTConnector {
        if (!MQTTConnector.instance) {
            MQTTConnector.instance = new MQTTConnector(logger);
        }
        MQTTConnector.instance.connect(MQTT_BROKER_URL || '', MQTT_USERNAME || '', MQTT_PASSWORD || '');
        return MQTTConnector.instance;
    }

    async connect(brokerUrl: string, username: string, password: string): Promise<void> {
        try {
            this.client = mqtt.connect(brokerUrl, {
                username,
                password,
                rejectUnauthorized: true,
                reconnectPeriod: 0,
                clientId: `ingeniti-api-${Math.random().toString(16).substring(2, 10)}`
            });

            this.client.on('connect', () => {
                this.logger.info('Connected to MQTT broker with TLS');
            });

            this.client.on('error', (error: Error) => {
                this.logger.error('MQTT connection error:', error.message);
                throw error;
            });
        } catch (error) {
            this.logger.error('Failed to connect to MQTT broker:', error);
            throw error;
        }
    }

    async controlDevice(userId: string, deviceId: string, state: boolean): Promise<void> {
        if (!this.client) {
            throw new Error('MQTT client not connected');
        }

        const topic = `/devices/${deviceId}/command`;
        const device = await getDevice(userId, deviceId);
        const currentSequence = (JSON.parse(device.connectorMetadata || '{}').commandSequence || 0);
        const nextSequence = (currentSequence + 1) % 65536;

        const buffer = Buffer.alloc(2);
        buffer[0] = state ? 0x20 : 0x21;  // 0x20 (32) for ON, 0x21 (33) for OFF
        buffer[1] = nextSequence;

        this.client!.publish(topic, buffer, (error?: Error) => {
            if (error) {
                this.logger.error(`Failed to publish MQTT message for device ${deviceId}:`, error);
                throw error;
            }
        });
        await updateDevice(userId, deviceId, { connectorMetadata: { commandSequence: nextSequence } });
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await new Promise<void>((resolve) => {
                this.client!.end(false, {}, () => {
                    this.client = null;
                    resolve();
                });
            });
        }
    }
}