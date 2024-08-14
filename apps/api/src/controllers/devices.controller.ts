import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Response } from 'express';
import { getDevices } from '../models/devices.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const devicesController = express.Router();

devicesController.get('/', async (req: WithAuthProp<Request>, res: Response) => {
  const devicesData = await getDevices(req.auth.userId as string);
  res.json({ devices: devicesData });
});

export default devicesController;
