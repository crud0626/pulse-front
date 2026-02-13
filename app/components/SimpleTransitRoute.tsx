import { css } from 'styled-system/css';

type SimpleTransitRouteProps = {
  arrivalStationName: string;
  routes: Array<{
    lineColor: string;
    lineName: string;
    stationName: string;
  }>;
};

const SimpleTransitRoute = ({ arrivalStationName, routes }: SimpleTransitRouteProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      {routes.map((route, idx) => (
        <div key={idx}>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            })}
          >
            <img
              src='/icons/subway-badge.png'
              alt=''
              className={css({
                width: '14px',
                height: '14px',
              })}
            />
            <p className={css({ flex: '1', fontSize: '14px' })}>
              <span style={{ color: route.lineColor }} className={css({ fontWeight: 'bold', paddingRight: '4px' })}>
                {route.lineName}
              </span>{' '}
              {route.stationName} {idx === 0 ? '승차' : '환승'}
            </p>
          </div>
          <div
            className={css({
              marginLeft: '6px',
              borderLeft: '1px solid #BBC1C9',
              width: 0,
              height: '14px',
            })}
          />
        </div>
      ))}
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        })}
      >
        <div className={css({ width: '14px', height: '14px', padding: '4px' })}>
          <span
            style={{ backgroundColor: '#000' }}
            className={css({
              display: 'block',
              width: 'full',
              height: 'full',
              rounded: 'full',
            })}
          />
        </div>
        <p className={css({ fontSize: '14px' })}>{arrivalStationName} 하차</p>
      </div>
    </div>
  );
};

export default SimpleTransitRoute;
