import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Request, Response } from 'express';
import { getSchedules, insertSchedule, getSchedule } from '../models/schedules.model';
import { HttpStatusCode } from '@ingeniti/shared';
import { getDevices } from '../models/devices.model'; // Import the getDevices function

interface Auth {
  userId: string;
}

type AuthRequest = Request & WithAuthProp<Auth>;

interface Schedule {
  id: string;
  userId: string;
  name: string; // Include name in the Schedule interface
  startTime: Date;
  endTime: Date;
  deviceIds: string[];
}

type CreateScheduleResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

type ScheduleResponse = {
  success: boolean;
  schedule?: Schedule;
  error?: string;
};

type SchedulesResponse = {
  success: boolean;
  schedules?: Schedule[];
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const schedulesController = express.Router();

schedulesController.post('/', async (req: AuthRequest, res: Response<CreateScheduleResponse>) => {
  try {
    const { name, startTime, endTime, deviceIds } = req.body;

    if (!name || !startTime || !endTime) {
      return res
        .status(HttpStatusCode.BAD_REQUEST_400)
        .json({ success: false, error: 'Name, start time, and end time are required' });
    }

    const userId = req.auth.userId;

    if (!userId) {
      return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ success: false, error: 'User ID is required' });
    }

    const schedule = await insertSchedule({
      userId,
      name,
      startTime: new Date(startTime as string),
      endTime: new Date(endTime),
      deviceIds: deviceIds || [],
    });

    return res.status(HttpStatusCode.CREATED_201).json({
      success: true,
      id: schedule.id,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to create schedule',
    });
  }
});

schedulesController.get('/', async (req: AuthRequest, res: Response<SchedulesResponse>) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ success: false, error: 'User ID is required' });
    }

    const schedules = await getSchedules(userId);
    const devices = await getDevices(userId);

    const deviceMap = new Map(devices.map((device) => [device.id, device.name]));

    // Map schedules to include device names instead of IDs
    const schedulesWithDeviceNames = schedules.map((schedule) => ({
      ...schedule,
      deviceIds: schedule.deviceIds.map((deviceId) => deviceMap.get(deviceId) || 'Unknown Device'),
    }));

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      schedules: schedulesWithDeviceNames,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch schedules',
    });
  }
});

schedulesController.get('/:id', async (req: AuthRequest, res: Response<ScheduleResponse>) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ success: false, error: 'User ID is required' });
    }

    const { id } = req.params;

    const schedule = await getSchedule(userId, id);

    if (!schedule) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Schedule not found',
      });
    }

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      schedule,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch schedule',
    });
  }
});

export default schedulesController;
