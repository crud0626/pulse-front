import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { add, differenceInMinutes, format, parse } from 'date-fns';
import { toast } from 'react-toastify/unstyled';
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
import { useGlobalModal } from '~/store/useGlobalModal';
import BottomSheet from '~/components/BottomSheet';
import type { SearchHistoryItem } from '~/schemas';

function getMinutesDifference(time1: string, time2: string) {
  // hh:mm:ss 형식을 Date 객체로 파싱
  const date1 = parse(time1, 'HH:mm:ss', new Date());
  const date2 = parse(time2, 'HH:mm:ss', new Date());

  // 분 단위 차이 계산
  return differenceInMinutes(date2, date1);
}

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

interface SimpleRoute {
  lineName: string;
  lineColor: string;
  stationName: string;
  time: number;
}

type RouteInformation = SearchRouteResult & { routes: SimpleRoute[] } & {
  timeTable: Array<{
    departureTime: string;
    arrivalTime: string;
    congestionLevel: CongestionLevels;
  }>;
};

interface StationCongestion {
  stationId: string;
  stationName: string;
  lineName: string;
  lineColor: string;
  arrivalTime: string | null;
  departureTime: string | null;
  boardingCount: number;
  alightingCount: number;
  totalPassengers: number;
}

const generateData = (routes: StationCongestion[]): SimpleRoute[] => {
  const data: SimpleRoute[] = [];

  let stationName = routes[0].stationName;
  let lastLineName = routes[0].lineName;
  let lastLineColor = routes[0].lineColor;
  let startTime = routes[0].departureTime;

  routes.forEach((r, idx) => {
    if (r.lineName !== lastLineName) {
      data.push({
        lineName: lastLineName,
        lineColor: lastLineColor,
        time: getMinutesDifference(startTime!, routes[idx - 1].arrivalTime!),
        stationName,
      });

      // 초기화
      lastLineName = r.lineName;
      lastLineColor = r.lineColor;
      startTime = r.departureTime;
      // 환승역 제거
      stationName = r.stationName;
    }
  });

  data.push({
    lineName: lastLineName,
    lineColor: lastLineColor,
    time: getMinutesDifference(startTime!, routes.at(-1)!.arrivalTime!),
    stationName,
  });

  return data;
};

export default function HomePage() {
  const [isOpenBookmarkNameSheet, setIsOpenBookmarkNameSheet] = useState(false);
  // TODO :: 네이밍 변경 필요
  const [willAddBookmarkItem, setWillAddBookmarkItem] = useState<null | SearchHistoryItem>(null);
  const [bookmarkName, setBookmarkName] = useState('');
  const { open: openGlobalModal } = useGlobalModal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { isLoggedIn } = useAuth();
  const { searchHistories, removeHistory, clearHistories } = useSearchHistory();

  const [isLoadingBookmarkRoute, setIsLoadingBookmarkRoute] = useState(false);
  const [bookmarkList, setBookmarkList] = useState<BookmarkItem[]>([]);

  const [bookmarkRoute, setBookmarkRoute] = useState<RouteInformation | null>(null);

  const addBookmark = async () => {
    try {
      if (!willAddBookmarkItem) throw Error('Invalid Search Conditions');

      await clientFetcher.post('/bookmarks', {
        name: bookmarkName,
        departureStationId: willAddBookmarkItem.startId,
        arrivalStationId: willAddBookmarkItem.endId,
        startTime: willAddBookmarkItem.startTime,
        endTime: willAddBookmarkItem.endTime,
      });

      setIsOpenBookmarkNameSheet(false);
      removeHistory(willAddBookmarkItem);

      toast('즐겨찾기에 추가되었습니다.');
    } catch (error) {
      toast('에러가 발생하였습니다.');
    }
  };

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

      const currentBookmarkRoute: RouteInformation = {
        ...data,
        routes: generateData(data.recommendations[0].stationCongestions),
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
          flexShrink: 0,
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
          <Link to={isLoggedIn ? '/mypage' : '/login'}>
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
                onClick={() => {
                  openGlobalModal({
                    type: 'confirm',
                    title: '최근 내역을 삭제할까요?',
                    description: '삭제하면 다시 복구할 수 없으니 신중히 결정해 주세요.',
                  }).then(() => {
                    clearHistories();
                  });
                }}
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
                        style={{ '--marker-bg': history.startLineColor } as React.CSSProperties}
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
                            backgroundColor: 'var(--marker-bg)',
                          },
                        })}
                      >
                        {history.startName}
                      </p>
                      <p
                        style={{ '--marker-bg': history.endLineColor } as React.CSSProperties}
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
                            backgroundColor: 'var(--marker-bg)',
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
                      onClick={() => {
                        setIsOpenBookmarkNameSheet(true);
                        setWillAddBookmarkItem(history);
                      }}
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
                            {format(parse(item.startTime, 'HH:mm:ss', new Date()), 'HH:mm')} ~{' '}
                            {format(parse(item.endTime, 'HH:mm:ss', new Date()), 'HH:mm')} 중 출발
                          </p>
                        </div>
                        {isLoadingBookmarkRoute ? (
                          <div>데이터를 불러오고 있습니다.</div>
                        ) : bookmarkRoute ? (
                          <>
                            <div>
                              <RouteTimelineBar routes={bookmarkRoute.routes} />
                            </div>
                            <SimpleTransitRoute
                              arrivalStationName={
                                bookmarkRoute.recommendations[0].stationCongestions.at(-1)?.stationName ?? ''
                              }
                              routes={bookmarkRoute.routes}
                            />
                            <hr className={css({ border: '1px dashed #D3D7DD' })} />
                            <RecommendedTimetable timeTables={bookmarkRoute?.timeTable ?? []} />
                          </>
                        ) : (
                          <div>데이터가 없습니다.</div>
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
      {isOpenBookmarkNameSheet && (
        <BottomSheet
          isOpen
          onClose={() => setIsOpenBookmarkNameSheet(false)}
          header={
            <button onClick={() => setIsOpenBookmarkNameSheet(false)}>
              <img src='/icons/close.png' alt='' className={css({ width: '24px', height: '24px' })} />
            </button>
          }
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
            })}
          >
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              })}
            >
              <div
                className={css({
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #BBC1C9',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  _focusWithin: {
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 2px 8px rgb(35 39 43/ 0.1)',
                  },
                })}
              >
                <input
                  type='text'
                  className={css({ width: '100%', height: '48px', outline: 'none' })}
                  maxLength={10}
                  value={bookmarkName}
                  placeholder='추가할 즐겨찾기 이름을 입력해주세요'
                  onChange={(event) => {
                    if (event.currentTarget.value.length > 10) return;

                    setBookmarkName(event.currentTarget.value);
                  }}
                />
              </div>
              <p className={css({ textAlign: 'right', fontSize: '12px', color: '#BBC1C9' })}>
                {bookmarkName.length}/10자
              </p>
            </div>
            <button
              onClick={addBookmark}
              disabled={bookmarkName.length < 1}
              className={css({
                paddingX: '12px',
                height: '50px',
                backgroundColor: '#23272B',
                borderRadius: '12px',
                color: 'white',
              })}
            >
              등록하기
            </button>
          </div>
        </BottomSheet>
      )}
    </main>
  );
}
