import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { add, format } from 'date-fns';
import { css } from 'styled-system/css';
import 'swiper/css';
import 'swiper/css/pagination';

import type { Route } from './+types/_index';
import SubwayIcon from '~/assets/subway.svg?react';
import { useSearchHistory } from '~/store/useSearchHistory';
import { MOCK_BOOKMARK_LIST } from '~/mocks/data';
import { clientFetcher } from '~/lib/axios/client';
import { useAuth } from '~/store/useAuth';

interface BookmarkItem {
  id: number;
  name: string;
  departureStationId: number;
  arrivalStationId: number;
  departureStationName: string;
  arrivalStationName: string;
  startTime: string;
  endTime: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function meta({}: Route.MetaArgs) {
  return [{ title: 'PULSE' }, { name: 'description', content: 'Welcome to PULSE!' }];
}

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { isLoggedIn } = useAuth();
  const { searchHistories } = useSearchHistory();

  const [isLoadingBookmarkRoute, setIsLoadingBookmarkRoute] = useState(false);
  const [bookmarkList, setBookmarkList] = useState<BookmarkItem[]>([]);

  const getBookmarkData = async () => {
    const targetBookmark = bookmarkList[activeIndex];
    if (!targetBookmark) return;

    setIsLoadingBookmarkRoute(true);
    try {
      await clientFetcher.get('/search/route', {
        params: {
          departureStationId: targetBookmark.departureStationId,
          arrivalStationId: targetBookmark.arrivalStationId,
          searchDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
          startTime: targetBookmark.startTime,
          endTime: targetBookmark.endTime,
        },
      });

      /**
       * TODO ::
       * 현재 북마크에 대한, route에 대한 상태 추가 필요
       * 응답 데이터 수정 후,
       */
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingBookmarkRoute(false);
    }
  };

  // TODO :: 현재 보여지는 favorite의 output 결과, 구조가 변경되어야함. route
  const [routes] = useState([
    {
      lineName: '4호선',
      lineColor: '#00A5DE',
      stationName: '삼각지',
      time: 35,
    },
    { lineName: '3호선', lineColor: '#EF7C1C', stationName: '충무로', time: 10 },
  ]);

  const getBookmarkList = async () => {
    try {
      const { data } = await clientFetcher.get<BookmarkItem[]>('/bookmarks');

      setBookmarkList(data);
    } catch (error) {
      window.alert('즐겨찾기 목록을 불러오지 못했습니다.');
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    getBookmarkData();
  }, [activeIndex]);

  useEffect(() => {
    if (!isLoggedIn) return;

    getBookmarkList();
  }, [isLoggedIn]);

  const displayedBookmark = bookmarkList[activeIndex];

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
        {searchHistories.length > 0 && (
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
                        {history.startName}
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
                        {history.endName}
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
        )}
        {/* 즐겨찾기 목록 */}
        {isLoggedIn && (
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
                {bookmarkList.length === 0 ? (
                  <div className={css({ display: 'flex', flexDirection: 'column', gap: '24px' })}>
                    <div className={css({ display: 'flex', flexDir: 'column', gap: '12px' })}>
                      <img src='/icons/empty-bookmark.png' alt='' />
                      <p className={css({ color: '#4D525A' })}>등록된 즐겨찾기가 없습니다.</p>
                    </div>
                    <button
                      className={css({
                        padding: '16px 10px',
                        backgroundColor: '#00F5A0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '10px',
                      })}
                    >
                      <img src='/icons/add.png' alt='' />
                      <p className={css({ color: '#23272B' })}>등록하기</p>
                    </button>
                  </div>
                ) : (
                  bookmarkList.map((item) => (
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
                              <img
                                src='/icons/check-badge.png'
                                alt=''
                                className={css({ width: '24px', height: '24px' })}
                              />
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
                            {item.startTime} ~ {item.endTime} 중 출발
                          </p>
                        </div>
                        {isLoadingBookmarkRoute ? (
                          <div>데이터를 불러오고 있습니다.</div>
                        ) : (
                          <>
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
                                    className={css({
                                      display: 'block',
                                      width: 'full',
                                      height: 'full',
                                      rounded: 'full',
                                    })}
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
                          </>
                        )}
                      </div>
                    </SwiperSlide>
                  ))
                )}
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
              {bookmarkList.map((_, idx) => (
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
        )}
      </div>
    </main>
  );
}
