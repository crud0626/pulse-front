import { format, parse } from 'date-fns';
import { css } from 'styled-system/css';

export type CongestionLevels = 'LOW' | 'MEDIUM' | 'HIGH';

const CONGESTION_LABELS = {
  LOW: '여유로워요',
  MEDIUM: '보통이에요',
  HIGH: '혼잡해요',
} as const satisfies Record<CongestionLevels, string>;

const CONGESTION_ICONS = {
  LOW: '/icons/congestion-best.png',
  MEDIUM: '/icons/congestion-normal.png',
  HIGH: '/icons/congestion-bad.png',
} as const satisfies Record<CongestionLevels, string>;

type RecommendedTimetableProps = {
  timeTables: Array<{
    departureTime: string;
    arrivalTime: string;
    congestionLevel: CongestionLevels;
  }>;
};

const RecommendedTimetable = ({ timeTables }: RecommendedTimetableProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      })}
    >
      {timeTables.map((timeTable, idx) => (
        <div
          className={css({
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            ...(idx === 0 && {
              rounded: '8px',
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(#E9F5F1, #E9F5F1), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }),
          })}
        >
          <img
            src={CONGESTION_ICONS[timeTable.congestionLevel]}
            alt=''
            className={css({ width: '24px', height: '24px', flexShrink: 0 })}
          />
          <p className={css({ fontWeight: idx === 0 ? 'bold' : 'normal', flexGrow: 1 })}>
            {CONGESTION_LABELS[timeTable.congestionLevel]}
          </p>
          <div
            className={css({
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
            })}
          >
            <p>
              출발{' '}
              <span className={css({ fontWeight: 'semibold' })}>
                {format(parse(timeTable.departureTime, 'HH:mm:ss', new Date()), 'HH:mm')}
              </span>
            </p>
            <p>-</p>
            <p>
              도착{' '}
              <span className={css({ fontWeight: 'semibold' })}>
                {format(parse(timeTable.arrivalTime, 'HH:mm:ss', new Date()), 'HH:mm')}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedTimetable;
