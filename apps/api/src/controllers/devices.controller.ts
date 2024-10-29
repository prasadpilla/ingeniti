import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Device, GenericError, HttpStatusCode, deviceOnBoardingFormSchema } from '@ingeniti/shared';
import { Request, Response } from 'express';
import { getDevices, insertDevice, updateDevice } from '../models/devices.model';
import { getDeviceEnergy, insertDeviceEnergy, SelectedDeviceEnergy } from '../models/deviceEnergy.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const devicesController = express.Router();

devicesController.post(
  '/',
  async (req: WithAuthProp<Request>, res: Response<{ success: boolean; id: string } | GenericError>) => {
    const validatedBody = deviceOnBoardingFormSchema.parse(req.body);
    if (!validatedBody) {
      return res.status(HttpStatusCode.BAD_REQUEST_400).json({ success: false, error: 'Invalid request body' });
    }
    const userId = req.auth.userId as string;

    const device = await insertDevice({
      userId: userId as string,
      name: validatedBody.name,
      identifier: validatedBody.identifier,
      serialNumber: validatedBody.serialNumber,
      usage: validatedBody.usage,
      type: validatedBody.type,
      location: validatedBody.location,
      averageEnergyCost: validatedBody.averageEnergyCost,
      minOffTime: validatedBody.minOffTime,
      brownOutVoltageChange: validatedBody.brownOutVoltageChange,
      brownOutFrequencyChange: validatedBody.brownOutFrequencyChange,
      utility: validatedBody.utility,
      country: validatedBody.country,
      meterServiceId: validatedBody.meterServiceId,
      isConnectedToPrimaryDevice: validatedBody.isConnectedToPrimaryDevice,
      utilitySmartPanel: validatedBody.utilitySmartPanel,
      countrySmartPanel: validatedBody.countrySmartPanel,
      meterServiceIdSmartPanel: validatedBody.meterServiceIdSmartPanel,
      maxLoad: validatedBody.maxLoad,
      isSwitchOn: true,
      isOnline: true,
    });

    res.status(HttpStatusCode.CREATED_201).json({ success: true, id: device.id });
  }
);

devicesController.get('/', async (req: WithAuthProp<Request>, res: Response<Device[]>) => {
  const userId = req.auth.userId as string;
  const devices = await getDevices(userId);
  const devicesWithSensors = devices.map((device) => ({
    ...device,
    isSensor: false,
  }));
  res.status(HttpStatusCode.OK_200).json(devicesWithSensors);
});

devicesController.get(
  '/device-energy',
  async (
    req: WithAuthProp<Request>,
    res: Response<{ success: boolean; data?: SelectedDeviceEnergy[] } | GenericError>
  ) => {
    const userId = req.auth.userId as string;
    const { deviceIds, startDate, endDate } = req.query;

    if (!deviceIds || !startDate || !endDate) {
      return res.status(HttpStatusCode.BAD_REQUEST_400).json({
        success: false,
        error: 'deviceIds, startDate, and endDate are required',
      });
    }

    let deviceIdsArray: string[];
    if (typeof deviceIds === 'string') {
      deviceIdsArray = deviceIds.split(',').filter((id) => id);
    } else if (Array.isArray(deviceIds)) {
      deviceIdsArray = deviceIds as string[];
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST_400).json({
        success: false,
        error: 'deviceIds must be a string or an array of strings',
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(HttpStatusCode.BAD_REQUEST_400).json({
        success: false,
        error: 'startDate and endDate must be valid dates',
      });
    }

    try {
      const energyData = await getDeviceEnergy(deviceIdsArray, userId, start.toISOString(), end.toISOString());

      return res.status(HttpStatusCode.OK_200).json({ success: true, data: energyData });
    } catch (error) {
      console.error('Error fetching device energy data:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
        success: false,
        error: 'Failed to fetch energy data',
      });
    }
  }
);

devicesController.put('/:id', async (req: WithAuthProp<Request>, res: Response<Device | GenericError>) => {
  const userId = req.auth.userId as string;
  const { id } = req.params;
  const { isSwitchOn } = req.body;

  const device = await updateDevice(userId, id, { isSwitchOn });
  res.status(HttpStatusCode.OK_200).json({ ...device, isSensor: false });
});

devicesController.get('/form-options', async (req: WithAuthProp<Request>, res: Response) => {
  const formOptions = {
    deviceUsageOptions: [
      { id: 1, label: 'Agricultural', value: 'agricultural' },
      { id: 2, label: 'Industrial', value: 'industrial' },
      { id: 3, label: 'Commercial', value: 'commercial' },
      { id: 4, label: 'Residential', value: 'residential' },
    ],
    deviceTypeOptions: [
      { id: 1, label: 'Pump/Motor', value: 'pump_motor' },
      { id: 2, label: 'Meter', value: 'meter' },
      { id: 3, label: 'Others', value: 'others' },
    ],
    utilityOptions: [
      { id: 1, label: 'APSPDC', value: 'APSPDC' },
      { id: 2, label: 'XYZ Utility', value: 'xyzUtility' },
      { id: 3, label: 'ABC Power', value: 'abcPower' },
      { id: 4, label: 'Global Energy', value: 'globalEnergy' },
      { id: 5, label: 'National Grid', value: 'nationalGrid' },
    ],
    countryOptions: [
      { id: 1, label: 'India', value: 'India' },
      { id: 2, label: 'USA', value: 'USA' },
      { id: 3, label: 'Canada', value: 'Canada' },
    ],
    smartPanelConnectionStatusOptions: [
      { id: 1, label: 'Primary Device Connected to Meter', value: true },
      { id: 2, label: 'Secondary Device Connected to Load', value: false },
    ],
  };

  res.status(HttpStatusCode.OK_200).json(formOptions);
});

devicesController.get('/add-random-entries', async (req: WithAuthProp<Request>, res: Response) => {
  const deviceId = 'bffc73fa-e21b-454e-922f-a31aca521365';
  const userId = req.auth.userId as string;
  const entries = [];

  for (let i = 0; i < 10; i++) {
    const energyValue = Math.floor(Math.random() * 100);
    const createdAt = new Date(Date.now() + i * 5 * 60 * 1000 + Math.random() * 1000);

    entries.push({
      deviceId,
      userId,
      energy: energyValue,
      createdAt,
    });
  }

  try {
    for (const entry of entries) {
      await insertDeviceEnergy({
        deviceId: entry.deviceId,
        userId: entry.userId,
        energy: entry.energy,
      });
    }

    res.status(201).json({ success: true, message: 'Random entries added successfully' });
  } catch (error) {
    console.error('Error adding random entries:', error);
    res.status(500).json({ success: false, error: 'Failed to add random entries' });
  }
});

export default devicesController;
