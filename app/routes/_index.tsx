import { useState } from 'react';
import { Link } from 'react-router';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { css } from 'styled-system/css';
import type { Route } from './+types/_index';
import 'swiper/css';
import 'swiper/css/pagination';

import SubwayIcon from '~/assets/subway.svg?react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'PULSE' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  /** MOCK DATA */
  const [searchHistories] = useState([
    {
      startId: 131,
      start: '종각역',
      endId: 349,
      end: '수서역',
      date: '2026-01-01',
      startTime: '12:00',
      endTime: '13:10',
    },
    {
      startId: 533,
      start: '광화문역',
      endId: 133,
      end: '서울역',
      date: '2026-01-05',
      startTime: '20:00',
      endTime: '21:00',
    },
  ]);
  const [favorites] = useState([
    {
      id: 1,
      name: '터벅터벅',
      startX: 126.9240786,
      startY: 37.5216246,
      start: '여의도역',
      endX: 127.1001714,
      endY: 37.5133497,
      end: '잠실역',
      minTime: '12:00',
      maxTime: '13:00',
      order: 1,
    },
    {
      id: 2,
      name: '출근2',
      startX: 126.9813633,
      startY: 37.4765746,
      start: '사당역',
      endX: 127.027619,
      endY: 37.4979518,
      end: '강남역',
      minTime: '21:00',
      maxTime: '22:00',
      order: 2,
    },
  ]);
  const [routes] = useState([
    {
      lineName: '4호선',
      lineColor: '#00A5DE',
      stationName: '삼각지',
      time: 35,
    },
    { lineName: '3호선', lineColor: '#EF7C1C', stationName: '충무로', time: 10 },
  ]);

  return (
    <main
      className={css({
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      })}
    >
      <header
        className={css({
          height: '48px',
          padding: '0px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <Link to='/'>
          <h1
            className={css({
              fontFamily: 'PressStart2P',
              fontSize: '18px',
              fontWeight: 'normal',
            })}
          >
            PULSE
          </h1>
        </Link>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          })}
        >
          <Link to='/bookmarks'>
            <img
              src='/icons/calendar-star.png'
              alt=''
              className={css({
                width: '24px',
                height: '24px',
              })}
            />
          </Link>
          <Link to='/mypage'>
            <img
              src='/icons/hamburger.png'
              alt=''
              className={css({
                width: '24px',
                height: '24px',
              })}
            />
          </Link>
        </div>
      </header>
      <div
        className={css({
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        })}
      >
        {/* Search Bar */}
        <Link
          to='/search'
          className={css({
            backgroundColor: 'white',
            borderRadius: '100px',
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'content-box, border-box',
            boxShadow: '0 4px 8px rgb(186 223 255 / 0.15)',
          })}
        >
          <div
            className={css({
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '8px',
            })}
          >
            <img src='/icons/search.png' alt='' className={css({ width: '24px', height: '24px' })} />
            <p
              className={css({
                color: '#BBC1C9',
              })}
            >
              주소를 검색해 주세요
            </p>
          </div>
        </Link>
        {/* Search History Section */}
        <section
          className={css({
            width: '100%',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 16px rgb(186 223 255 / 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          })}
        >
          <div
            className={css({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            })}
          >
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <img src='/icons/clock-badge.png' alt='' className={css({ width: '24px', height: '24px' })} />
              <h2
                className={css({
                  fontWeight: 'semibold',
                  fontSize: '20px',
                  color: 'black',
                })}
              >
                최근내역
              </h2>
            </div>
            <button
              className={css({
                color: '#7E8490',
                fontSize: '14px',
              })}
            >
              전체삭제
            </button>
          </div>
          <Swiper spaceBetween={16} slidesPerView={1.3} className={css({ width: '100%' })}>
            {searchHistories.map((history) => (
              <SwiperSlide className={css({ backgroundColor: '#F5F7F9', borderRadius: '12px', padding: '12px' })}>
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'start',
                  })}
                >
                  <div
                    className={css({
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      overflow: 'hidden',
                    })}
                  >
                    <p
                      className={css({
                        position: 'relative',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingLeft: '16px',

                        _before: {
                          display: 'block',
                          position: 'absolute',
                          content: '""',
                          width: '8px',
                          height: '8px',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          marginY: 'auto',
                          rounded: 'full',
                          // TODO :: 변경 처리
                          backgroundColor: '#000',
                        },
                      })}
                    >
                      {history.start}
                    </p>
                    <p
                      className={css({
                        position: 'relative',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingLeft: '16px',

                        _before: {
                          display: 'block',
                          position: 'absolute',
                          content: '""',
                          width: '8px',
                          height: '8px',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          marginY: 'auto',
                          rounded: 'full',
                          // TODO :: 변경 처리
                          backgroundColor: '#000',
                        },
                      })}
                    >
                      {history.end}
                    </p>
                    <p
                      className={css({
                        position: 'relative',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        paddingLeft: '16px',
                      })}
                    >
                      {`${history.startTime}~${history.endTime} 중 출발`}
                    </p>
                  </div>
                  <button
                    className={css({
                      flex: '0 1 24px',
                    })}
                  >
                    <img src='/icons/empty-star.png' alt='' className={css({ width: '24px', height: '24px' })} />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        {/* 즐겨찾기 목록 */}
        <section className={css({ position: 'relative', paddingBottom: '23px' })}>
          <div
            className={css({
              padding: '16px',
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 16px rgb(35 39 43 / 0.1)',
            })}
          >
            <Swiper
              onSwiper={setSwiperInstance}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              spaceBetween={40}
            >
              {favorites.map((item) => (
                <SwiperSlide>
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    })}
                  >
                    <div
                      className={css({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      })}
                    >
                      <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
                        <div
                          className={css({
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '8px',
                          })}
                        >
                          <img src='/icons/check-badge.png' alt='' className={css({ width: '24px', height: '24px' })} />
                          <h2
                            className={css({
                              fontSize: '20px',
                              fontWeight: 'semibold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            })}
                          >
                            {item.name}
                          </h2>
                        </div>
                        <button className={css({ fontSize: '14px', color: '#7E8490' })}>상세보기</button>
                      </div>
                      <p
                        className={css({
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        })}
                      >
                        {item.minTime} ~ {item.maxTime} 중 출발
                      </p>
                    </div>
                    {/* TODO :: Route 경로 */}
                    <div>
                      {/* RouteTimelineBar */}
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
                              className={css({ position: 'absolute', left: 0, top: 0, width: '16px', height: '16px' })}
                            />
                            <p className={css({ color: 'white', fontSize: '12px' })}>{route.time}분</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Route 경로 (Simple) */}
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
                              <span
                                style={{ color: route.lineColor }}
                                className={css({ fontWeight: 'bold', paddingRight: '4px' })}
                              >
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
                            className={css({ display: 'block', width: 'full', height: 'full', rounded: 'full' })}
                          />
                        </div>
                        <p className={css({ fontSize: '14px' })}>금호역 하차</p>
                      </div>
                    </div>
                    <hr className={css({ border: '1px dashed #D3D7DD' })} />
                    {/* TODO :: TOP 3 영역 */}
                    <div
                      className={css({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      })}
                    >
                      <div
                        className={css({
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          // BEST ROUTE STYLE
                          rounded: '8px',
                          border: '1px solid transparent',
                          backgroundImage:
                            'linear-gradient(#E9F5F1, #E9F5F1), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
                          backgroundOrigin: 'border-box',
                          backgroundClip: 'padding-box, border-box',
                        })}
                      >
                        <img
                          src='/icons/congestion-best.png'
                          alt=''
                          className={css({ width: '24px', height: '24px', flexShrink: 0 })}
                        />
                        <p className={css({ fontWeight: 'bold', flexGrow: 1 })}>여유로워요</p>
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
                            출발 <span className={css({ fontWeight: 'semibold' })}>12:40</span>
                          </p>
                          <p>-</p>
                          <p>
                            도착 <span className={css({ fontWeight: 'semibold' })}>13:10</span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={css({
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        })}
                      >
                        <img
                          src='/icons/congestion-normal.png'
                          alt=''
                          className={css({ width: '24px', height: '24px', flexShrink: 0 })}
                        />
                        <p className={css({ flexGrow: 1 })}>보통이에요</p>
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
                            출발 <span className={css({ fontWeight: 'semibold' })}>12:40</span>
                          </p>
                          <p>-</p>
                          <p>
                            도착 <span className={css({ fontWeight: 'semibold' })}>13:10</span>
                          </p>
                        </div>
                      </div>
                      <div
                        className={css({
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        })}
                      >
                        <img
                          src='/icons/congestion-bad.png'
                          alt=''
                          className={css({ width: '24px', height: '24px', flexShrink: 0 })}
                        />
                        <p className={css({ flexGrow: 1 })}>혼잡해요</p>
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
                            출발 <span className={css({ fontWeight: 'semibold' })}>12:40</span>
                          </p>
                          <p>-</p>
                          <p>
                            도착 <span className={css({ fontWeight: 'semibold' })}>13:10</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div
            className={css({
              width: '100%',
              position: 'absolute',
              bottom: '0px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
            })}
          >
            {/* TODO :: 수정 필요 */}
            {[0, 1].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  swiperInstance?.slideTo(idx);
                }}
                className={css({
                  width: activeIndex === idx ? '16px' : '7px',
                  height: '7px',
                  bg: activeIndex === idx ? '#00F5A0' : '#9DA3AD',
                  rounded: 'full',
                  cursor: 'pointer',
                })}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
