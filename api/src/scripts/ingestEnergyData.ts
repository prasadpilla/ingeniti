import { insertDeviceEnergy } from '../models/deviceEnergy.model';

interface EnergyDataParams {
  deviceId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  intervalMinutes: number;
}

async function generateAndIngestEnergyData({
  deviceId,
  userId,
  startDate,
  endDate,
  intervalMinutes,
}: EnergyDataParams) {
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const energyValue = Math.floor(Math.random() * 10) + 1;

    await insertDeviceEnergy({
      deviceId,
      userId,
      energy: energyValue,
      timestamp: currentDate,
    });

    currentDate.setMinutes(currentDate.getMinutes() + intervalMinutes);
  }
}

async function main() {
  const deviceId = process.argv[2];
  const userId = process.argv[3];
  const startDateStr = process.argv[4];
  const endDateStr = process.argv[5];
  const intervalMinutes = parseInt(process.argv[6], 10);

  if (!deviceId || !userId || !startDateStr || !endDateStr || !intervalMinutes) {
    console.error('Usage: pnpm tsx ingestEnergyData.ts <deviceId> <userId> <startDate> <endDate> <intervalMinutes>');
    process.exit(1);
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)');
    process.exit(1);
  }

  try {
    await generateAndIngestEnergyData({
      deviceId,
      userId,
      startDate,
      endDate,
      intervalMinutes,
    });
    console.log('Energy data ingestion completed successfully');
  } catch (error) {
    console.error('Error ingesting energy data:', error);
    process.exit(1);
  }
}

main();
