import { css } from 'styled-system/css';
import SubwayIcon from '~/assets/subway.svg?react';

type RouteTimelineBarProps = {
  routes: Array<{
    lineColor: string;
    time: number;
  }>;
};

const RouteTimelineBar = ({ routes }: RouteTimelineBarProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        gap: '16px',
        height: '16px',
        backgroundColor: '#D3D7DD',
        borderRadius: 'full',
      })}
    >
      {routes.map((route, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: route.lineColor,
            flexGrow: route.time,
          }}
          className={css({
            position: 'relative',
            textAlign: 'center',
            borderRadius: 'full',
          })}
        >
          <SubwayIcon
            className={css({
              position: 'absolute',
              left: 0,
              top: 0,
              width: '16px',
              height: '16px',
            })}
          />
          <p className={css({ color: 'white', fontSize: '12px' })}>{route.time}분</p>
        </div>
      ))}
    </div>
  );
};

export default RouteTimelineBar;
