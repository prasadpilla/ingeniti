import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Request, Response } from 'express';
import { Device, deviceOnBoardingFormSchema, EnergyData, EnergyResponse, GenericError, HttpStatusCode } from 'shared';
import { tuyaConnector } from '../config';
import { getDeviceEnergy } from '../models/deviceEnergy.model';
import { getDevice, getDevices, insertDevice, updateDevice } from '../models/devices.model';
import { MQTTConnector } from '../services/mqttConnector';
import { logError, logInfo } from '../utils/logger';

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
      connector: validatedBody.connector,
      isSwitchOn: false,
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
  async (req: WithAuthProp<Request>, res: Response<EnergyResponse | GenericError>) => {
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
      const rawEnergyData = await getDeviceEnergy(deviceIdsArray, userId, start.toISOString(), end.toISOString());
      const devices = await getDevices(userId);
      const deviceMap = new Map(devices.map((device) => [device.id, device.name]));

      // Calculate time difference in days
      const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      // Determine interval
      const interval =
        diffInDays <= 2 ? 'hourly' : diffInDays <= 31 ? 'daily' : diffInDays <= 90 ? 'weekly' : 'monthly';

      // Get time key based on interval
      const getTimeKey = (date: Date) => {
        switch (interval) {
          case 'hourly':
            return date.toISOString().slice(0, 13) + ':00:00.000Z';
          case 'daily':
            return date.toISOString().slice(0, 10) + 'T00:00:00.000Z';
          case 'weekly': {
            const weekNumber = Math.ceil(
              (date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7
            );
            const yearStart = new Date(date.getFullYear(), 0, 1);
            const weekStart = new Date(yearStart.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000);
            return weekStart.toISOString();
          }
          case 'monthly':
            return date.toISOString().slice(0, 7) + '-01T00:00:00.000Z';
          default:
            return date.toISOString().slice(0, 10) + 'T00:00:00.000Z';
        }
      };

      // Aggregate data based on interval and device
      const aggregatedData = rawEnergyData.reduce((acc: EnergyData[], curr) => {
        const date = new Date(curr.timestamp);
        const timeKey = getTimeKey(date);

        const existingEntry = acc.find(
          (item) => getTimeKey(new Date(item.timestamp)) === timeKey && item.deviceId === curr.deviceId
        );

        if (existingEntry) {
          existingEntry.energy += curr.energy;
        } else {
          acc.push({
            id: '',
            userId: '',
            deviceId: curr.deviceId,
            deviceName: deviceMap.get(curr.deviceId) || 'Unknown Device',
            energy: curr.energy,
            timestamp: new Date(timeKey).toISOString(),
          });
        }

        return acc;
      }, []);

      // Sort by date and then by deviceId
      aggregatedData.sort((a, b) => {
        const dateCompare = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (dateCompare === 0) {
          return a.deviceId.localeCompare(b.deviceId);
        }
        return dateCompare;
      });

      return res.status(HttpStatusCode.OK_200).json({
        success: true,
        data: aggregatedData,
        interval,
      });
    } catch (error) {
      console.error('Error fetching device energy data:', error);
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
        success: false,
        error: 'Failed to fetch energy data',
      });
    }
  }
);

devicesController.get('/get-device-info/:deviceId', async (req: WithAuthProp<Request>, res: Response) => {
  const deviceId = req.params.deviceId;

  try {
    const device = await getDevice(req.auth.userId as string, deviceId);
    if (!device || !device.connectorDeviceId) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Device not found or Tuya device ID is missing',
      });
    }

    const deviceInfo = await tuyaConnector.getDeviceInfo(device.connectorDeviceId);
    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      data: deviceInfo,
    });
  } catch (error) {
    console.error('Error fetching device info from Tuya:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch device info',
    });
  }
});

devicesController.get('/get-status/:deviceId', async (req: WithAuthProp<Request>, res: Response) => {
  const deviceId = req.params.deviceId;

  try {
    const device = await getDevice(req.auth.userId as string, deviceId);
    if (!device || !device.connectorDeviceId) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Device not found or Tuya device ID is missing',
      });
    }

    const deviceStatus = await tuyaConnector.getDeviceStatus(device.connectorDeviceId);
    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      status: deviceStatus.result[0].switch_1 === 'true',
    });
  } catch (error) {
    console.error('Error fetching device state from Tuya:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch device state',
    });
  }
});

devicesController.get('/metrics', async (req: WithAuthProp<Request>, res: Response) => {
  const userId = req.auth.userId as string;

  try {
    // Fetch all devices for the user
    const devices = await getDevices(userId);
    console.log('Devices:', devices); // Log devices

    const totalDevices = devices.length;
    const connectedDevices = devices.filter((device) => device.isOnline).length;

    console.log('Total Devices:', totalDevices);
    console.log('Connected Devices:', connectedDevices);

    // Fetch total energy consumption for the last week from the local database
    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last week

    const energyConsumptionResults = await getDeviceEnergy(
      devices.map((device) => device.id),
      userId,
      startTime,
      endTime
    );

    // Calculate total load by summing up the totalEnergy values
    const totalLoad = energyConsumptionResults.reduce((acc: number, curr: { energy: number }) => {
      return acc + curr.energy;
    }, 0);

    console.log('Total Load:', totalLoad);

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      metrics: {
        total: { value: totalDevices, prevValue: 0 },
        connected: { value: connectedDevices, prevValue: 0 },
        totalLoad: { value: totalLoad, prevValue: 0 },
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch metrics',
    });
  }
});

devicesController.get('/metrics', async (req: WithAuthProp<Request>, res: Response) => {
  const userId = req.auth.userId as string;

  try {
    // Fetch all devices for the user
    const devices = await getDevices(userId);
    console.log('Devices:', devices); // Log devices

    const totalDevices = devices.length;
    const connectedDevices = devices.filter((device) => device.isOnline).length;

    console.log('Total Devices:', totalDevices);
    console.log('Connected Devices:', connectedDevices);

    // Fetch total energy consumption for the last week from the local database
    const now = new Date();
    const endTime = now.toISOString();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Last week

    const energyConsumptionResults = await getDeviceEnergy(
      devices.map((device) => device.id),
      userId,
      startTime,
      endTime
    );

    // Calculate total load by summing up the totalEnergy values
    const totalLoad = energyConsumptionResults.reduce((acc: number, curr: { energy: number }) => {
      return acc + curr.energy;
    }, 0);

    console.log('Total Load:', totalLoad);

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      metrics: {
        total: { value: totalDevices, prevValue: 0 },
        connected: { value: connectedDevices, prevValue: 0 },
        totalLoad: { value: totalLoad, prevValue: 0 },
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch metrics',
    });
  }
});

devicesController.post('/control/:deviceId', async (req: WithAuthProp<Request>, res: Response) => {
  const deviceId = req.params.deviceId;
  const { status } = req.body;
  req.log.info({ deviceId, status }, 'Control device request received');

  try {
    const device = await getDevice(req.auth.userId as string, deviceId);
    if (!device) {
      return res.status(HttpStatusCode.NOT_FOUND_404).json({
        success: false,
        error: 'Device not found',
      });
    }

    if (device.connector === 'ingeniti') {
      await MQTTConnector.getInstance(req.log).controlDevice(req.auth.userId as string, device.id, status);
    } else if (device.connector === 'tuya' && device.connectorDeviceId) {
      await tuyaConnector.controlDevice(device.connectorDeviceId, status);
    } else {
      throw new Error('Invalid device connector configuration');
    }

    await updateDevice(req.auth.userId as string, deviceId, { isSwitchOn: status });
    req.log.info(`Device ${deviceId} controlled successfully`);
    return res.status(HttpStatusCode.OK_200).json({
      success: true,
    });
  } catch (error) {
    logError(error as Error, 'Error controlling device');
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to control device',
    });
  }
});

devicesController.get('/energy-consumption-ranking', async (req: WithAuthProp<Request>, res: Response) => {
  const { energyType, energyAction, statisticsType, startTime, endTime, limit, containChilds } = req.query;

  try {
    const energyData = await tuyaConnector.getDeviceEnergy(
      energyType as string,
      energyAction as string,
      statisticsType as string,
      startTime as string,
      endTime as string,
      Number(limit) || 10,
      containChilds === 'true'
    );

    return res.status(HttpStatusCode.OK_200).json({
      success: true,
      data: energyData.result,
    });
  } catch (error) {
    console.error('Error fetching energy consumption ranking:', error);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
      success: false,
      error: 'Failed to fetch energy consumption ranking',
    });
  }
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
      { id: 2, label: 'Air Conditioner', value: 'air_conditioner' },
      { id: 3, label: 'Geyser', value: 'geyser' },
      { id: 4, label: 'Dishwasher', value: 'dishwasher' },
      { id: 5, label: 'EV Charger', value: 'ev_charger' },
      { id: 6, label: 'Meter', value: 'meter' },
      { id: 7, label: 'HVAC', value: 'hvac' },
      { id: 8, label: 'Exhaust Fans', value: 'exhaust_fans' },
      { id: 9, label: 'Others', value: 'others' },
    ],
    utilityOptions: [
      { id: 1, label: 'APEPDCL', value: 'APEPDCL' },
      { id: 2, label: 'BESCOM', value: 'BESCOM' },
      { id: 3, label: 'TANGEDCO', value: 'TANGEDCO' },
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

export default devicesController;
