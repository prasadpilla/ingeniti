import { Request, Response } from 'express';
import { TuyaConnector } from '../services/tuyaConnector';
import { addMinutes, isBefore, isEqual } from 'date-fns';
import { getAllSchedules } from '../models/schedules.model';
import { getDevice } from '../models/devices.model'; // Import the getDevice function

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const tasksController = express.Router();

const clientId = process.env.TUYA_CLIENT_ID;
const secret = process.env.TUYA_SECRET;

if (!clientId || !secret) {
  throw new Error('Tuya credentials expected');
}

// Initialize TuyaConnector with configuration
const tuyaConnector = new TuyaConnector({
  accessKey: clientId,
  secretKey: secret,
  baseUrl: 'https://openapi.tuyain.com',
});

tasksController.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Task executed successfully' });
});

tasksController.post('/checkSchedule', async (req: Request, res: Response) => {
  const now = new Date();
  const twoMinutesFromNow = addMinutes(now, 2);

  const schedules = await getAllSchedules();

  for (const schedule of schedules) {
    const { startTime, endTime, deviceIds } = schedule;

    if (!startTime || !endTime) {
      continue;
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (isBefore(now, startDateTime) && isBefore(startDateTime, twoMinutesFromNow)) {
      for (const deviceId of deviceIds) {
        const device = await getDevice(schedule.userId, deviceId);
        if (device && device.tuyaDeviceId) {
          await tuyaConnector.freezeDevice(device.tuyaDeviceId, 1);
          console.log('Device Freezing:', device.tuyaDeviceId);
        } else {
          console.log('No Tuya device ID found for device:', deviceId);
        }
      }
    }

    if (isEqual(twoMinutesFromNow, endDateTime)) {
      for (const deviceId of deviceIds) {
        const device = await getDevice(schedule.userId, deviceId);
        if (device && device.tuyaDeviceId) {
          await tuyaConnector.freezeDevice(device.tuyaDeviceId, 0);
          console.log('Device Unfreezed:', device.tuyaDeviceId);
        } else {
          console.log('No Tuya device ID found for device:', deviceId);
        }
      }
    }
  }

  res.json({ success: true });
});

export default tasksController;
