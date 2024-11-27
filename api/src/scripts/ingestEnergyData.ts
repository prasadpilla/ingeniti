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
  let recordsInserted = 0;

  while (currentDate <= endDate) {
    const energyValue = Math.floor(Math.random() * 10) + 1;

    await insertDeviceEnergy({
      deviceId,
      userId,
      energy: energyValue,
      timestamp: currentDate,
    });
    recordsInserted++;

    currentDate.setMinutes(currentDate.getMinutes() + intervalMinutes);
  }

  return recordsInserted;
}

async function main() {
  const deviceId = process.argv[2];
  const userId = process.argv[3];
  const startDateStr = process.argv[4];
  const endDateStr = process.argv[5];
  const intervalMinutes = parseInt(process.argv[6], 10) || 60;

  if (!deviceId || !userId) {
    console.error('Usage: pnpm tsx ingestEnergyData.ts <deviceId> <userId> [startDate] [endDate] [intervalMinutes]');
    process.exit(1);
  }

  const endDate = endDateStr ? new Date(endDateStr) : new Date();
  const startDate = startDateStr
    ? new Date(startDateStr)
    : new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)');
    process.exit(1);
  }

  try {
    const recordsInserted = await generateAndIngestEnergyData({
      deviceId,
      userId,
      startDate,
      endDate,
      intervalMinutes,
    });

    if (recordsInserted === 0) {
      console.error('No energy data was ingested. Check your date range and interval.');
      process.exit(1);
    }

    console.log(`Energy data ingestion completed successfully. Inserted ${recordsInserted} records.`);
    process.exit(0);
  } catch (error) {
    console.error('Error ingesting energy data:', error);
    process.exit(1);
  }
}

main();
