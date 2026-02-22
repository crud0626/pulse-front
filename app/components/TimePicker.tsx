import { format, getHours, getMinutes, parse, roundToNearestMinutes } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import Picker from 'react-mobile-picker';
import { css } from 'styled-system/css';
import { convertTo24HourFormat } from '~/utils/date';

export type TimePeriod = 'AM' | 'PM';

interface TimePickerValue {
  // INFO :: react-mobile-picker에서 인덱스 시그니처 형태의 객체를 요구하기 때문에 호환이 안되어 추가
  [key: string]: string | number;
  hour: number;
  minute: number;
  period: TimePeriod;
}

type TimePickerProps = {
  defaultValue?: string;
  /** HH:mm 형식의 최소 선택 가능 시간 (e.g. "14:30") */
  minTime?: string;
  onChange: (value: string) => void;
};

const TIME_PICKER_SELECTIONS: {
  hour: number[];
  minute: number[];
  period: TimePeriod[];
} = {
  hour: Array.from({ length: 12 }, (_, idx) => idx),
  minute: Array.from({ length: 12 }, (_, idx) => idx * 5),
  period: ['AM', 'PM'],
};

function getDefaultValue(dateStr?: string): TimePickerValue {
  const date = dateStr ? parse(dateStr, 'HH:mm', new Date()) : new Date();
  const defaultTime = roundToNearestMinutes(date, { nearestTo: 5, roundingMethod: 'ceil' });

  return {
    period: format(defaultTime, 'a') as TimePeriod,
    hour: getHours(defaultTime) % 12,
    minute: getMinutes(defaultTime),
  };
}

function toMinutes(hour: number, minute: number, period: TimePeriod): number {
  const hour24 = period === 'AM' ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  return hour24 * 60 + minute;
}

function isOptionDisabled(
  key: keyof typeof TIME_PICKER_SELECTIONS,
  option: number | TimePeriod,
  currentValue: TimePickerValue,
  minTotalMinutes: number
): boolean {
  const testValue = { ...currentValue, [key]: option };
  return toMinutes(testValue.hour, testValue.minute, testValue.period as TimePeriod) < minTotalMinutes;
}

const TimePicker = ({ defaultValue, minTime, onChange }: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState<TimePickerValue>(getDefaultValue(minTime ?? defaultValue));

  const minTotalMinutes = useMemo(() => {
    if (!minTime) return null;
    const parsed = parse(minTime, 'HH:mm', new Date());
    return getHours(parsed) * 60 + getMinutes(parsed);
  }, [minTime]);

  const handleChange = (value: TimePickerValue) => {
    if (minTotalMinutes !== null) {
      const selectedMinutes = toMinutes(value.hour, value.minute, value.period as TimePeriod);
      if (selectedMinutes < minTotalMinutes) {
        return;
      }
    }
    setSelectedTime(value);
  };

  return (
    <div className={css({ padding: '16px' })}>
      <Picker value={selectedTime} onChange={handleChange} wheelMode='normal'>
        {(Object.keys(TIME_PICKER_SELECTIONS) as Array<keyof typeof TIME_PICKER_SELECTIONS>).map((key) => (
          <Picker.Column key={key} name={key}>
            {TIME_PICKER_SELECTIONS[key].map((option) => (
              <Picker.Item key={option} value={option}>
                {({ selected }) => {
                  const disabled =
                    minTotalMinutes !== null && isOptionDisabled(key, option, selectedTime, minTotalMinutes);
                  return (
                    <p
                      className={css({
                        color: disabled ? '#1a1a1a' : selected ? '#00F5A0' : '#35393F',
                        opacity: disabled ? 0.3 : 1,
                      })}
                    >
                      {option}
                    </p>
                  );
                }}
              </Picker.Item>
            ))}
          </Picker.Column>
        ))}
      </Picker>
      <button
        onClick={() => {
          const timeString = convertTo24HourFormat(
            `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`
          );

          onChange(timeString);
        }}
        className={css({
          backgroundColor: '#23272B',
          color: 'white',
          fontWeight: 'medium',
          width: 'full',
          height: '50px',
          borderRadius: '12px',
        })}
      >
        등록하기
      </button>
    </div>
  );
};

export default TimePicker;
