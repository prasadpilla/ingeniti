import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Response } from 'express';
import { GenericError, deviceOnBoardingFormSchema } from '@ingeniti/shared';
import { insertDevice } from '../models/devices.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const devicesController = express.Router();

devicesController.post(
  '/',
  async (req: WithAuthProp<Request>, res: Response<{ success: boolean; id: string } | GenericError>) => {
    const validatedBody = deviceOnBoardingFormSchema.parse(req.body);
    const userId = req.auth.userId as string;

    const device = await insertDevice({
      userId,
      ...validatedBody,
    });

    res.json({ success: true, id: device.id });
  }
);

export default devicesController;
