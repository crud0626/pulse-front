import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { add, format } from 'date-fns';
import { css } from 'styled-system/css';
import 'swiper/css';
import 'swiper/css/pagination';

import type { Route } from './+types/_index';

import { useSearchHistory } from '~/store/useSearchHistory';
import { type SearchRouteResult } from '~/mocks/data';
import { clientFetcher } from '~/lib/axios/client';
import { useAuth } from '~/store/useAuth';
import RouteTimelineBar from '~/components/RouteTimelineBar';
import RecommendedTimetable, { type CongestionLevels } from '~/components/RecommendedTimetable';
import SimpleTransitRoute from '~/components/SimpleTransitRoute';

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

type RouteDetail = SearchRouteResult & {
  timeTable: Array<{
    departureTime: string;
    arrivalTime: string;
    congestionLevel: CongestionLevels;
  }>;
};

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { isLoggedIn } = useAuth();
  const { searchHistories } = useSearchHistory();

  const [isLoadingBookmarkRoute, setIsLoadingBookmarkRoute] = useState(false);
  const [bookmarkList, setBookmarkList] = useState<BookmarkItem[]>([]);

  const [bookmarkRoute, setBookmarkRoute] = useState<RouteDetail | null>(null);

  const getBookmarkData = async () => {
    const targetBookmark = bookmarkList[activeIndex];
    if (!targetBookmark) return;

    setIsLoadingBookmarkRoute(true);
    try {
      const { data } = await clientFetcher.get<SearchRouteResult>('/search/route', {
        params: {
          departureStationId: targetBookmark.departureStationId,
          arrivalStationId: targetBookmark.arrivalStationId,
          searchDate: format(add(new Date(), { days: 1 }), 'yyyy-MM-dd'),
          startTime: targetBookmark.startTime,
          endTime: targetBookmark.endTime,
        },
      });

      const currentBookmarkRoute: RouteDetail = {
        ...data,
        timeTable: data.recommendations.map(({ departureTime, arrivalTime, congestionLevel }) => ({
          departureTime,
          arrivalTime,
          congestionLevel,
        })),
      };

      setBookmarkRoute(currentBookmarkRoute);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingBookmarkRoute(false);
    }
  };

  // TODO :: bookmarkRoute에 검색 결과에서 다뤘던 구조 적용 + SimpleTransitRoute의 props로 arrivalStationName 할당
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
  }, [isLoggedIn, activeIndex, bookmarkList]);

  useEffect(() => {
    if (!isLoggedIn) return;

    getBookmarkList();
  }, [isLoggedIn]);

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
                            <div>
                              <RouteTimelineBar routes={routes} />
                            </div>
                            {/* TODO :: arrivalStationName 할당 */}
                            <SimpleTransitRoute arrivalStationName='테스트' routes={routes} />
                            <hr className={css({ border: '1px dashed #D3D7DD' })} />
                            <RecommendedTimetable timeTables={bookmarkRoute?.timeTable ?? []} />
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
