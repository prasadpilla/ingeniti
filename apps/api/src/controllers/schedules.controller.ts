import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Request, Response } from 'express';
import { getSchedules, insertSchedule, getSchedule, deleteSchedule, updateSchedule } from '../models/schedules.model';
import { HttpStatusCode } from '@ingeniti/shared';
import { getDevices } from '../models/devices.model';
interface Auth {
  userId: string;
}

type AuthRequest = Request & WithAuthProp<Auth>;

interface Schedule {
  id: string;
  userId: string;
  name: string;
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

// Create a new schedule
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

// Get all schedules for the authenticated user
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

// Get a specific schedule by ID
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

schedulesController.put('/:id', async (req: AuthRequest, res: Response<ScheduleResponse>) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ success: false, error: 'User ID is required' });
    }

    const { id } = req.params;
    const { name, startTime, endTime, deviceIds } = req.body;

    const updatedSchedule = await updateSchedule({
      id,
      userId,
      name,
      startTime: new Date(startTime as string),
      endTime: new Date(endTime),
      deviceIds: deviceIds || [],
    });

    if (!updatedSchedule) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Schedule not found or could not be updated',
      });
    }

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      schedule: updatedSchedule,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to update schedule',
    });
  }
});

schedulesController.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(HttpStatusCode.UNAUTHORIZED_401).json({ success: false, error: 'User ID is required' });
    }

    const { id } = req.params;

    const deleted = await deleteSchedule(userId, id);

    if (!deleted) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Schedule not found or could not be deleted',
      });
    }

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to delete schedule',
    });
  }
});

export default schedulesController;
