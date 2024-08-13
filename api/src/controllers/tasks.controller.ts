import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
const tasksController = express.Router();

tasksController.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Task executed successfully' });
});

export default tasksController;
