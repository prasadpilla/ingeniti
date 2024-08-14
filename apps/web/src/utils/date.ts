import { formatDistanceToNow } from 'date-fns';
import { logError } from './logger';

export function readableDateTime(dateTimeStr: string | null | undefined): string {
  if (!dateTimeStr) {
    return '';
  }
  try {
    const dateTime = new Date(dateTimeStr);
    return formatDistanceToNow(dateTime, { addSuffix: true });
  } catch (error: unknown) {
    logError(error as Error);
    return 'Invalid date';
  }
}
