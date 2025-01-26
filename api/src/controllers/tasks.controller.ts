import { addMinutes, isBefore, isEqual } from 'date-fns';
import { Request, Response } from 'express';
import { tuyaConnector } from '../config';
import { getAllDevices, getDevice } from '../models/devices.model'; // Import the getDevice and getDevices functions
import { getAllSchedules } from '../models/schedules.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const tasksController = express.Router();

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
        if (device && device.connectorDeviceId) {
          await tuyaConnector.controlDevice(device.connectorDeviceId, true);
          console.log('Device Turned On:', device.connectorDeviceId);
        } else {
          console.log('No Tuya device ID found for device:', deviceId);
        }
      }
    }

    if (isEqual(twoMinutesFromNow, endDateTime)) {
      for (const deviceId of deviceIds) {
        const device = await getDevice(schedule.userId, deviceId);
        if (device && device.connectorDeviceId) {
          await tuyaConnector.controlDevice(device.connectorDeviceId, false);
          console.log('Device Turned Off:', device.connectorDeviceId);
        } else {
          console.log('No Tuya device ID found for device:', deviceId);
        }
      }
    }
  }

  res.json({ success: true });
});

tasksController.get('/totalEnergyConsumption', async (req: Request, res: Response) => {
  const now = new Date();
  const endTime = now.toISOString();
  const startTime = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      error: 'startTime and endTime are required',
    });
  }

  try {
    const devices = await getAllDevices();
    const deviceIds = devices.map((device) => device.connectorDeviceId).filter((id): id is string => id !== null);

    if (deviceIds.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No devices found in the database',
      });
    }

    const energyConsumptionPromises = deviceIds.map(async (deviceId) => {
      try {
        const energyData = await tuyaConnector.deviceEnergyStats(
          deviceId,
          'ele_usage',
          'hour',
          startTime as string,
          endTime as string
        );

        return {
          deviceId,
          totalEnergy: energyData.result.total,
        };
      } catch (error) {
        console.error(`Error fetching energy data for device ${deviceId}:`, error);
        return {
          deviceId,
          totalEnergy: 0,
        };
      }
    });

    const energyConsumptionResults = await Promise.all(energyConsumptionPromises);

    res.json({
      success: true,
      data: energyConsumptionResults,
    });
  } catch (error) {
    console.error('Error fetching total energy consumption:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch total energy consumption',
    });
  }
});

export default tasksController;
