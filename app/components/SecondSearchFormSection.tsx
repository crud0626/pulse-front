import { useState } from 'react';
import { add, addMonths, format, isSameMonth, isToday, parse, startOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { css } from 'styled-system/css';
import { CalendarMonth, DayPicker, useDayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

import BottomSheet from './BottomSheet';
import TimePicker from './TimePicker';

type SecondSearchFormSectionProps = {
  isOpenSection: boolean;
  selectedDate?: Date;
  departureTimeRange: Record<'min' | 'max', null | string>;
  toggleSection: () => void;
  onSelectDate: (selectedDate?: Date) => void;
  onChangeTimeRange: (type: 'min' | 'max', value: string) => void;
};

function getMonthRange() {
  return Array.from({ length: 12 }, (_, i) => addMonths(startOfMonth(new Date()), i));
}

function CustomCaption({
  children,
  calendarMonth,
  onClick,
}: React.HTMLAttributes<HTMLSpanElement> & { calendarMonth: CalendarMonth; displayIndex: number }) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => previousMonth && goToMonth(previousMonth)}>
          <img
            src='/icons/chevron.png'
            alt=''
            className={css({ width: '20px', height: '20px', transform: 'rotate(90deg)' })}
          />
        </button>
        <p onClick={onClick} className={css({ color: '#303030', fontWeight: 'medium', textDecoration: 'underline' })}>
          {format(calendarMonth.date, 'yyyy년 M월', { locale: ko })}
        </p>
        <button onClick={() => nextMonth && goToMonth(nextMonth)}>
          <img
            src='/icons/chevron.png'
            alt=''
            className={css({ width: '20px', height: '20px', transform: 'rotate(-90deg)' })}
          />
        </button>
      </div>
      {children}
    </div>
  );
}

const SecondSearchFormSection = ({
  isOpenSection,
  selectedDate,
  departureTimeRange,
  toggleSection,
  onSelectDate,
  onChangeTimeRange,
}: SecondSearchFormSectionProps) => {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [isOpenMonthSelector, setIsOpenMonthSelector] = useState(false);
  const [isOpenTimeSelector, setIsOpenTimeSelector] = useState<null | 'min' | 'max'>(null);
  const [focusSection, setFocusSection] = useState<0 | 1>(0);

  return (
    <details
      open={isOpenSection}
      name='accordion'
      className={css({
        flexShrink: 0,
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        _open: {
          flexGrow: 1,
          flexShrink: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
        },
      })}
    >
      <summary
        onClick={(event) => {
          event.preventDefault();
          toggleSection();
        }}
        className={css({
          listStyle: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        {isOpenSection ? (
          <div className={css({ backgroundColor: '#E7EAED', display: 'flex', padding: '4px', rounded: 'full' })}>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setFocusSection(0);
              }}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'full',
                backgroundColor: focusSection === 0 ? 'white' : 'transparent',
                boxShadow: focusSection === 0 ? '0 2px 4px rgba(35, 39, 43, 0.2)' : 'none',
              })}
            >
              <img src='/icons/calendar.png' alt='' className={css({ width: '24px', height: '24px' })} />
              <p className={css({ fontSize: '14px' })}>{selectedDate ? format(selectedDate, 'MM.dd') : '날짜'}</p>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setFocusSection(1);
              }}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: 'full',
                backgroundColor: focusSection === 1 ? 'white' : 'transparent',
                boxShadow: focusSection === 1 ? '0 2px 4px rgba(35, 39, 43, 0.2)' : 'none',
              })}
            >
              <img src='/icons/clock.png' alt='' className={css({ width: '24px', height: '24px' })} />
              <p className={css({ fontSize: '14px' })}>
                {departureTimeRange.min && departureTimeRange.max
                  ? `${departureTimeRange.min}~${departureTimeRange.max}`
                  : '시간'}
              </p>
            </button>
          </div>
        ) : (
          <p
            className={css({
              fontSize: '18px',
              fontWeight: 'semibold',
              color: '#23272B',
            })}
          >
            최소 출발시간
          </p>
        )}
        <img
          src='/icons/chevron.png'
          alt=''
          className={css({
            width: '24px',
            height: '24px',
            transition: 'transform 0.2s',
            'details[open] &': {
              transform: 'rotate(180deg)',
            },
          })}
        />
      </summary>
      <div
        className={css({
          paddingTop: '24px',
        })}
      >
        {focusSection === 0 ? (
          <DayPicker
            components={{
              Month: (props) => (
                <CustomCaption
                  {...props}
                  onClick={() => {
                    setIsOpenMonthSelector(true);
                  }}
                />
              ),
            }}
            hideNavigation
            mode='single'
            locale={ko}
            month={displayMonth}
            onMonthChange={setDisplayMonth}
            startMonth={new Date()}
            endMonth={add(new Date(), { years: 1 })}
            disabled={{ before: new Date(), after: add(new Date(), { years: 1 }) }}
            selected={selectedDate}
            classNames={{
              months: 'rdp-months relative',
            }}
            onSelect={(selectDate) => {
              onSelectDate(selectDate);
              if (selectDate) {
                setFocusSection(1);
              }
            }}
          />
        ) : (
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            })}
          >
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
              <label htmlFor='min-time' className={css({ fontSize: '18px', fontWeight: 'semibold' })}>
                최소 출발 시간
              </label>
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  border: '1px solid #BBC1C9',
                  borderRadius: '12px',
                })}
                onClick={() => {
                  setIsOpenTimeSelector('min');
                }}
              >
                <input
                  readOnly
                  id='min-time'
                  type='text'
                  placeholder='최소 출발시간을 입력해주세요.'
                  value={
                    departureTimeRange.min
                      ? format(parse(departureTimeRange.min, 'HH:mm', new Date()), 'hh시 mm분 a')
                      : ''
                  }
                  className={css({ flexGrow: 1, minWidth: 0, outline: 'none' })}
                />
                <img
                  src='/icons/chevron.png'
                  alt=''
                  className={css({ flexShrink: 0, width: '24px', height: '24px' })}
                />
              </div>
            </div>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
              <label htmlFor='max-time' className={css({ fontSize: '18px', fontWeight: 'semibold' })}>
                최대 출발 시간
              </label>
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  border: '1px solid #BBC1C9',
                  borderRadius: '12px',
                })}
                onClick={() => {
                  setIsOpenTimeSelector('max');
                }}
              >
                <input
                  readOnly
                  id='max-time'
                  type='text'
                  placeholder='최대 출발시간을 입력해주세요.'
                  value={
                    departureTimeRange.max
                      ? format(parse(departureTimeRange.max, 'HH:mm', new Date()), 'hh시 mm분 a')
                      : ''
                  }
                  className={css({ flexGrow: 1, minWidth: 0, outline: 'none' })}
                />
                <img
                  src='/icons/chevron.png'
                  alt=''
                  className={css({ flexShrink: 0, width: '24px', height: '24px' })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {isOpenTimeSelector === 'min' && (
        <BottomSheet
          isOpen
          header={<p className={css({ color: '#23272B', fontSize: '18px', fontWeight: 'semibold' })}>최소 출발시간</p>}
          onClose={() => setIsOpenTimeSelector(null)}
        >
          <TimePicker
            minTime={selectedDate && isToday(selectedDate) ? format(new Date(), 'HH:mm') : undefined}
            defaultValue={departureTimeRange.min ?? undefined}
            onChange={(values) => {
              onChangeTimeRange('min', values);
              setIsOpenTimeSelector(null);
            }}
          />
        </BottomSheet>
      )}
      {isOpenTimeSelector === 'max' && (
        <BottomSheet
          isOpen
          header={<p className={css({ color: '#23272B', fontSize: '18px', fontWeight: 'semibold' })}>최대 출발시간</p>}
          onClose={() => setIsOpenTimeSelector(null)}
        >
          <TimePicker
            minTime={departureTimeRange.min ?? undefined}
            defaultValue={departureTimeRange.max ?? undefined}
            onChange={(values) => {
              onChangeTimeRange('max', values);
              setIsOpenTimeSelector(null);
            }}
          />
        </BottomSheet>
      )}
      {isOpenMonthSelector && (
        <BottomSheet
          isOpen
          header={<p className={css({ color: '#23272B', fontSize: '18px', fontWeight: 'semibold' })}>월 선택하기</p>}
          onClose={() => setIsOpenMonthSelector(false)}
        >
          <div className={css({ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' })}>
            {getMonthRange().map((date) => (
              <button
                key={date.toString()}
                onClick={() => {
                  setDisplayMonth(date);
                  setIsOpenMonthSelector(false);
                }}
                className={css({
                  width: '100%',
                  paddingY: '8px',
                  textAlign: 'left',
                  _hover: { backgroundColor: '#E7EAED' },
                })}
              >
                <p className={css({ color: isSameMonth(displayMonth, date) ? '#00F5A0' : '#35393F' })}>
                  {format(date, 'yy년 M월')}
                </p>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </details>
  );
};

export default SecondSearchFormSection;
