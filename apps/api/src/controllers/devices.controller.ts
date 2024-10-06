import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Device, GenericError, HttpStatusCode, deviceOnBoardingFormSchema } from '@ingeniti/shared';
import { Request, Response } from 'express';
import { getDevices, insertDevice, updateDevice } from '../models/devices.model';

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
  res.status(HttpStatusCode.OK_200).json(devices);
});

devicesController.put('/:id', async (req: WithAuthProp<Request>, res: Response<Device | GenericError>) => {
  const userId = req.auth.userId as string;
  const { id } = req.params;
  const { isSwitchOn } = req.body;

  const device = await updateDevice(userId, id, { isSwitchOn });
  res.status(HttpStatusCode.OK_200).json(device);
});

export default devicesController;
