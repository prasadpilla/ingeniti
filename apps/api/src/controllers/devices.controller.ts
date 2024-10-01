import { WithAuthProp } from '@clerk/clerk-sdk-node';
import { Request, Response } from 'express';
import { GenericError, HttpStatusCode, deviceOnBoardingFormSchema } from '@ingeniti/shared';
import { insertDevice } from '../models/devices.model';

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
      userId,
      ...validatedBody,
    });

    res.status(HttpStatusCode.CREATED_201).json({ success: true, id: device.id });
  }
);

export default devicesController;
