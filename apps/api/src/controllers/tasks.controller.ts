import { Request, Response } from 'express';
import { RequestHelper } from '../services/tuyaConnector'; // Import the RequestHelper
import { getSchedules } from '../models/schedules.model';
import { addMinutes, isBefore, isEqual } from 'date-fns';
import { WithAuthProp } from '@clerk/clerk-sdk-node';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const tasksController = express.Router();

const clientId = process.env.TUYA_CLIENT_ID;
const secret = process.env.TUYA_SECRET;

if (!clientId || !secret) {
  throw new Error('Tuya credentials expected');
}

const requestHelper = new RequestHelper(clientId, secret);

tasksController.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Task executed successfully' });
});

tasksController.post('/checkSchedule', async (req: WithAuthProp<Request>, res: Response) => {
  const userId = req.auth.userId as string;
  const now = new Date();
  const twoMinutesFromNow = addMinutes(now, 2);
  const schedules = await getSchedules(userId);

  for (const schedule of schedules) {
    const { startTime, endTime, deviceIds } = schedule;

    if (!startTime || !endTime) {
      continue;
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    if (isBefore(now, startDateTime) && isBefore(startDateTime, twoMinutesFromNow)) {
      for (const deviceId of deviceIds) {
        await requestHelper.freezeDevice(deviceId, 1);
        console.log('Device Freezing:', deviceId);
      }
    }

    if (isEqual(twoMinutesFromNow, endDateTime)) {
      for (const deviceId of deviceIds) {
        await requestHelper.freezeDevice(deviceId, 0);
        console.log('Device Unfreezed:', deviceId);
      }
    }
  }

  res.json({ success: true });
});

export default tasksController;
