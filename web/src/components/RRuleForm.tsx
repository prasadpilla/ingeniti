import { Plus, Trash } from '@phosphor-icons/react';
import { addDays, format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import React, { useEffect, useState } from 'react';
import { Button } from '@/shadcn/ui/button';

interface RRuleFormProps {
  onChange: (rrules: string[]) => void;
  initialRrules?: string[];
}

interface ParsedRRule {
  FREQ?: string;
  INTERVAL?: string;
  COUNT?: string;
  UNTIL?: string;
  DTSTART?: string;
  [key: string]: string | undefined;
}

const parseRrule = (rrule: string): ParsedRRule => {
  const lines = rrule.split('\n');
  const result: ParsedRRule = {};

  lines.forEach((line) => {
    if (line.startsWith('DTSTART')) {
      const [key, value] = line.split(':');
      result[key] = value;
    } else {
      const parts = line.split(';');
      parts.forEach((part) => {
        const [key, value] = part.split('=');
        result[key] = value;
      });
    }
  });
  return result;
};

const RRuleForm: React.FC<RRuleFormProps> = ({ onChange, initialRrules }) => {
  const [schedules, setSchedules] = useState<string[]>(
    initialRrules || [`DTSTART:${formatInTimeZone(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'")}\nFREQ=YEARLY;INTERVAL=1`]
  );

  const [currentSchedules, setCurrentSchedules] = useState(
    schedules.map((schedule) => {
      const initialValues = parseRrule(schedule);
      return {
        frequency: initialValues.FREQ || 'YEARLY',
        interval: Number(initialValues.INTERVAL) || 1,
        endType: initialValues.COUNT ? 'count' : initialValues.UNTIL ? 'until' : 'never',
        endCount: Number(initialValues.COUNT) || 1,
        endDate: initialValues.UNTIL
          ? format(parseISO(initialValues.UNTIL), 'yyyy-MM-dd')
          : format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startDateTime: initialValues.DTSTART
          ? formatInTimeZone(
              parseISO(initialValues.DTSTART),
              Intl.DateTimeFormat().resolvedOptions().timeZone,
              "yyyy-MM-dd'T'HH:mm"
            )
          : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        showFrequencyOptions: false,
        showEndTypeOptions: false,
      };
    })
  );

  useEffect(() => {
    const updatedSchedules = currentSchedules.map((currentSchedule) => {
      const localDate = parseISO(currentSchedule.startDateTime);
      const utcDate = formatInTimeZone(localDate, 'UTC', "yyyyMMdd'T'HHmmss'Z'");

      let newRrule = `DTSTART:${utcDate}\nFREQ=${currentSchedule.frequency};INTERVAL=${currentSchedule.interval}`;
      if (currentSchedule.endType === 'count') {
        newRrule += `;COUNT=${currentSchedule.endCount}`;
      } else if (currentSchedule.endType === 'until') {
        newRrule += `;UNTIL=${currentSchedule.endDate.replace(/-/g, '')}`;
      }
      return newRrule;
    });
    setSchedules(updatedSchedules);
    onChange(updatedSchedules);
  }, [currentSchedules, onChange]);
  const handleScheduleChange = (index: number, updatedSchedule: any) => {
    const newSchedules = [...currentSchedules];
    newSchedules[index] = updatedSchedule;
    setCurrentSchedules(newSchedules);
  };

  const handleAddSchedule = () => {
    const newRrule = `DTSTART:${formatInTimeZone(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'")}\nFREQ=YEARLY;INTERVAL=1`;
    setSchedules([...schedules, newRrule]);
    setCurrentSchedules([
      ...currentSchedules,
      {
        frequency: 'YEARLY',
        interval: 1,
        endType: 'never',
        endCount: 1,
        endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        startDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        showFrequencyOptions: false,
        showEndTypeOptions: false,
      },
    ]);
    onChange([...schedules, newRrule]);
  };

  const handleDeleteSchedule = (index: number) => {
    const updatedSchedules = schedules.filter((_, i) => i !== index);
    const updatedCurrentSchedules = currentSchedules.filter((_, i) => i !== index);
    setSchedules(updatedSchedules);
    setCurrentSchedules(updatedCurrentSchedules);
    onChange(updatedSchedules);
  };

  return (
    <div>
      {currentSchedules.map((currentSchedule, index) => (
        <div key={index} className="mb-4 border rounded-lg p-4 shadow-md relative">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="">
              <label className="block mb-2">Start At</label>
              <input
                type="datetime-local"
                className="p-2 border bg-background rounded w-full"
                value={currentSchedule.startDateTime}
                onChange={(e) => handleScheduleChange(index, { ...currentSchedule, startDateTime: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">Repeat</label>
              <div className="relative">
                <button
                  type="button"
                  className="p-2 border rounded w-full text-left"
                  onClick={() =>
                    handleScheduleChange(index, {
                      ...currentSchedule,
                      showFrequencyOptions: !currentSchedule.showFrequencyOptions,
                    })
                  }
                >
                  {currentSchedule.frequency.charAt(0) + currentSchedule.frequency.slice(1).toLowerCase()}
                </button>
                {currentSchedule.showFrequencyOptions && (
                  <div className="absolute z-10 w-full bg-background border rounded mt-1">
                    {['Yearly', 'Monthly', 'Weekly', 'Daily'].map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        className="block w-full text-left p-2 hover:bg-primary/80 hover:text-white"
                        onClick={() =>
                          handleScheduleChange(index, {
                            ...currentSchedule,
                            frequency: freq.toUpperCase(),
                            showFrequencyOptions: false,
                          })
                        }
                      >
                        {freq.charAt(0) + freq.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block mb-2">Times</label>
              <input
                type="number"
                className="p-2 border rounded bg-background w-full"
                value={currentSchedule.interval}
                onChange={(e) => handleScheduleChange(index, { ...currentSchedule, interval: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block mb-2">Ends</label>
              <div className="relative">
                <button
                  type="button"
                  className="p-2 border rounded w-full text-left"
                  onClick={() =>
                    handleScheduleChange(index, {
                      ...currentSchedule,
                      showEndTypeOptions: !currentSchedule.showEndTypeOptions,
                    })
                  }
                >
                  {currentSchedule.endType === 'never'
                    ? 'Never'
                    : currentSchedule.endType === 'count'
                      ? 'Ends After Iterations'
                      : 'Ends on Date'}
                </button>
                {currentSchedule.showEndTypeOptions && (
                  <div className="absolute z-10 w-full bg-background border rounded mt-1">
                    {['never', 'count', 'until'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        className="block w-full text-left p-2 hover:bg-primary/80 hover:text-white"
                        onClick={() =>
                          handleScheduleChange(index, { ...currentSchedule, endType: type, showEndTypeOptions: false })
                        }
                      >
                        {type === 'never' ? 'Never' : type === 'count' ? 'Ends After Iterations' : 'Ends on Date'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {currentSchedule.endType === 'count' && (
                <input
                  type="number"
                  className="p-2 border bg-background rounded mt-2 w-full"
                  value={currentSchedule.endCount}
                  onChange={(e) =>
                    handleScheduleChange(index, { ...currentSchedule, endCount: Number(e.target.value) })
                  }
                />
              )}
              {currentSchedule.endType === 'until' && (
                <input
                  type="date"
                  className="p-2 border bg-background rounded mt-2 w-full"
                  value={currentSchedule.endDate}
                  onChange={(e) => handleScheduleChange(index, { ...currentSchedule, endDate: e.target.value })}
                />
              )}
            </div>
          </div>
          {currentSchedules.length > 1 && (
            <button
              type="button"
              className="absolute top-2 right-2 p-2 text-red-500 rounded"
              onClick={() => handleDeleteSchedule(index)}
            >
              <Trash size={16} />
            </button>
          )}
        </div>
      ))}
      <div className="flex justify-end mt-4">
        <Button variant={'outline'} type="button" className="p-2 rounded flex items-center" onClick={handleAddSchedule}>
          <Plus size={16} className="mr-2" /> Add Schedule
        </Button>
      </div>
    </div>
  );
};

export default RRuleForm;
