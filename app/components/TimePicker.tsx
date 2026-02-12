import { format, getHours, getMinutes, parse } from 'date-fns';
import { useState } from 'react';
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

  return {
    period: format(date, 'a') as TimePeriod,
    hour: getHours(date) % 12,
    minute: getMinutes(date),
  };
}

/**
 * TODO ::
 * - disabled도 처리 필요
 */

const TimePicker = ({ defaultValue, onChange }: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState<TimePickerValue>(getDefaultValue(defaultValue));

  return (
    <div className={css({ padding: '16px' })}>
      <Picker value={selectedTime} onChange={setSelectedTime} wheelMode='normal'>
        {(Object.keys(TIME_PICKER_SELECTIONS) as Array<keyof typeof TIME_PICKER_SELECTIONS>).map((key) => (
          <Picker.Column key={key} name={key}>
            {TIME_PICKER_SELECTIONS[key].map((option) => (
              <Picker.Item key={option} value={option}>
                {({ selected }) => <p className={css({ color: selected ? '#00F5A0' : '#35393F' })}>{option}</p>}
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
