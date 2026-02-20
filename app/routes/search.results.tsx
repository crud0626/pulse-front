import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { differenceInMinutes, format, parse } from 'date-fns';
import { css } from 'styled-system/css';
import { toast } from 'react-toastify/unstyled';

import BottomSheet from '~/components/BottomSheet';
import RecommendedTimetable, { type CongestionLevels } from '~/components/RecommendedTimetable';
import { clientFetcher } from '~/lib/axios/client';
import { searchConditionSchema, type SearchConditionType } from '~/schemas';
import { useSearchHistory } from '~/store/useSearchHistory';

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

interface Recommendation {
  departureTime: string;
  arrivalTime: string;
  totalTime: number;
  transferCount: number;
  congestionScore: number;
  congestionLevel: CongestionLevels;
  stationCongestions: StationCongestion[];
}

interface SearchRouteResponse {
  departureStationId: number;
  arrivalStationId: number;
  departureStationName: string;
  arrivalStationName: string;
  travelDate: string;
  dayType: string;
  recommendations: Recommendation[];
  message: string | null;
}

function getMinutesDifference(time1: string, time2: string) {
  // hh:mm:ss 형식을 Date 객체로 파싱
  const date1 = parse(time1, 'HH:mm:ss', new Date());
  const date2 = parse(time2, 'HH:mm:ss', new Date());

  // 분 단위 차이 계산
  return differenceInMinutes(date2, date1);
}

interface RouteDetail {
  startStationName: string;
  lineName: string;
  lineColor: string;
  times: number;
  passStations: string[];
}

export default function SearchResultPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addHistory } = useSearchHistory();
  const [searchCondition, setSearchCondition] = useState<null | SearchConditionType>(null);
  const [isAddedBookmark, setIsAddedBookmark] = useState(false);
  const [isOpenBookmarkNameSheet, setIsOpenBookmarkNameSheet] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [toggleDetailRoute, setToggleDetailRoute] = useState<boolean[]>([]);
  const [searchResult, setSearchResult] = useState<
    null | (SearchRouteResponse & { route: Recommendation; routeDetails: RouteDetail[] })
  >(null);

  const generateData = (routes: StationCongestion[]): RouteDetail[] => {
    const data: RouteDetail[] = [];

    let startStationName = routes[0].stationName;
    let lastLineName = routes[0].lineName;
    let lastLineColor = routes[0].lineColor;
    let startTime = routes[0].departureTime;
    let throughStations: string[] = [];

    routes.forEach((r, idx) => {
      if (r.lineName !== lastLineName) {
        data.push({
          lineName: lastLineName,
          lineColor: lastLineColor,
          times: getMinutesDifference(startTime!, routes[idx - 1].arrivalTime!),
          passStations: throughStations,
          startStationName,
        });

        // 초기화
        lastLineName = r.lineName;
        lastLineColor = r.lineColor;
        startTime = r.departureTime;
        // 환승역 제거
        throughStations.pop();
        throughStations = [];
        startStationName = r.stationName;
      } else {
        if (idx !== 0) {
          throughStations.push(r.stationName);
        }
      }
    });

    // 도착역 제거
    throughStations.pop();
    data.push({
      lineName: lastLineName,
      lineColor: lastLineColor,
      times: getMinutesDifference(startTime!, routes.at(-1)!.arrivalTime!),
      passStations: throughStations,
      startStationName,
    });

    return data;
  };

  const addBookmark = async () => {
    try {
      if (!searchCondition) throw Error('Invalid Search Conditions');

      await clientFetcher.post('/bookmarks', {
        name: bookmarkName,
        departureStationId: searchCondition.departureStationId,
        arrivalStationId: searchCondition.arrivalStationId,
        startTime: searchCondition.startTime,
        endTime: searchCondition.endTime,
      });

      setIsOpenBookmarkNameSheet(false);
      setIsAddedBookmark(true);
      toast('즐겨찾기에 추가되었습니다.');
    } catch (error) {
      toast('에러가 발생하였습니다.');
    }
  };

  const handleClickAddBookmark = () => {
    setIsOpenBookmarkNameSheet((prev) => !prev);
  };

  const getSearchResult = async () => {
    try {
      const { data } = await clientFetcher.get<SearchRouteResponse>('/search/route');

      const routeDetails = generateData(data.recommendations[0].stationCongestions);
      const nextSearchResult = {
        ...data,
        route: data.recommendations[0],
        routeDetails,
      };

      setSearchResult(nextSearchResult);
      setToggleDetailRoute(new Array(nextSearchResult.routeDetails.length).fill(false));
      return nextSearchResult;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const searchCondition = {
      departureStationId: Number(searchParams.get('departureStationId')),
      arrivalStationId: Number(searchParams.get('arrivalStationId')),
      searchDate: searchParams.get('searchDate'),
      startTime: searchParams.get('startTime'),
      endTime: searchParams.get('endTime'),
    };

    const { success } = searchConditionSchema.safeParse(searchCondition);

    if (!success) {
      navigate('/search');
      return;
    }

    setSearchCondition(searchCondition as SearchConditionType);

    // TODO :: MSW보다 뒤 늦게 걸리는 현상으로 인해, 임시로 delay 처리
    setTimeout(async () => {
      const searchResultData = await getSearchResult();
      if (searchResultData) {
        addHistory({
          startId: searchResultData.departureStationId.toString(),
          startName: searchResultData.departureStationName,
          startLine: searchResultData.routeDetails[0].lineName,
          startLineColor: searchResultData.routeDetails[0].lineColor,
          endId: searchResultData.arrivalStationId.toString(),
          endName: searchResultData.arrivalStationName,
          endLine: searchResultData.routeDetails.at(-1)!.lineName,
          startTime: searchCondition.startTime!,
          endTime: searchCondition.endTime!,
          endLineColor: searchResultData.routeDetails.at(-1)!.lineColor,
        });
      }
    }, 500);
  }, []);

  // TODO :: 결괏값을 받아오지 못하는 경우에 대한 예외케이스 추가 필요
  if (searchResult === null) return;

  return (
    <main
      className={css({
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      })}
    >
      <header
        className={css({
          height: '48px',
          padding: '0px 16px',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <img
            src='/icons/chevron.png'
            alt=''
            className={css({ width: '24px', height: '24px', transform: 'rotate(90deg)' })}
          />
        </button>
        <p>검색결과</p>
        <button disabled={isAddedBookmark} onClick={handleClickAddBookmark}>
          <img
            src={isAddedBookmark ? '/icons/fill-star.png' : '/icons/empty-star.png'}
            alt=''
            className={css({ width: '24px', height: '24px' })}
          />
        </button>
      </header>
      <div
        className={css({
          paddingX: '16px',
          paddingTop: '12px',
          paddingBottom: isAddedBookmark ? '16px' : '74px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowX: 'hidden',
          overflowY: 'auto',
        })}
      >
        {/* 섹션 1 : 조건 */}
        <section
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: 'rgba(186, 223, 255, 0.1)',
          })}
        >
          {/* TODO :: 호선 정보 및 호선 컬러 */}
          <p
            className={css({
              color: '#23272B',
              fontWeight: 'medium',
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              gap: '8px',
            })}
          >
            <div
              className={css({
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <span
                className={css({ width: '10px', height: '10px', borderRadius: 'full', backgroundColor: 'yellow' })}
              />
              <p className={css({ color: '#23272B', fontWeight: 'medium' })}>{searchResult.departureStationName}</p>
            </div>
            <img
              src='/icons/chevron.png'
              alt=''
              className={css({ width: '18px', height: '18px', transform: 'rotate(-90deg)' })}
            />
            <div
              className={css({
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '8px',
              })}
            >
              <span
                className={css({ width: '10px', height: '10px', borderRadius: 'full', backgroundColor: 'yellow' })}
              />
              <p className={css({ color: '#23272B', fontWeight: 'medium' })}>{searchResult.arrivalStationName}</p>
            </div>
          </p>
          {/* TODO :: 사용자 출발 시간 범위가 없음 */}
          <p className={css({ color: '#23272B', fontWeight: 'medium' })}>
            {format(searchResult.travelDate, 'MM월 dd일')}, 10:30 - 13:30 중 출발
          </p>
        </section>
        {/* 섹션 2 : Route output */}
        <section
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '20px',
          })}
        >
          <div className={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}>
            <h3 className={css({ color: '#23272B', fontSize: '18px', fontWeight: 'semibold' })}>출발시간 추천</h3>
            <p className={css({ color: '#4D525A', fontSize: '14px' })}>{searchResult.route.totalTime}분 소요</p>
          </div>
          <RecommendedTimetable timeTables={searchResult.recommendations} />
        </section>
        {/* 섹션 3 : 상세 Route 경로 */}
        <section
          className={css({
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            gap: '12px',
            backgroundColor: 'white',
            borderRadius: '20px',
          })}
        >
          <h3 className={css({ color: '#23272B', fontSize: '18px', fontWeight: 'semibold' })}>
            {searchResult.route.totalTime}분 소요
          </h3>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
            {/* 컴포넌트 분리 상세 Route 영역 */}
            {searchResult.routeDetails.map((routeDetail, routeDetailIdx) => (
              <>
                <div className={css({ display: 'flex', gap: '12px' })}>
                  <p
                    style={{ backgroundColor: routeDetail.lineColor }}
                    className={css({
                      position: 'relative',
                      width: '24px',
                      height: '24px',
                      textAlign: 'center',
                      color: 'white',
                      borderRadius: 'full',
                    })}
                  >
                    {routeDetail.lineName[0]}
                    <span
                      style={{ backgroundColor: routeDetail.lineColor }}
                      className={css({
                        position: 'absolute',
                        height: '32px',
                        width: '1px',
                        top: 'calc(100% + 4px)',
                        left: '50%',
                      })}
                    />
                  </p>
                  <div>
                    <p
                      className={css({ color: '#23272B', fontWeight: 'semibold' })}
                    >{`${routeDetail.startStationName} ${routeDetailIdx === 0 ? '승차' : '환승'}`}</p>
                    <button
                      className={css({ display: 'flex', alignItems: 'center' })}
                      onClick={() => {
                        setToggleDetailRoute((prev) => {
                          const nextState = [...prev];
                          nextState[routeDetailIdx] = !prev[routeDetailIdx];
                          return nextState;
                        });
                      }}
                    >
                      <p
                        className={css({ color: '#4D525A', fontSize: '14px' })}
                      >{`${routeDetail.times}분소요 · ${routeDetail.passStations.length + 1}개역 이동`}</p>
                      <img
                        src='/icons/chevron.png'
                        alt=''
                        className={css({
                          width: '18px',
                          height: '18px',
                          transform: toggleDetailRoute[routeDetailIdx] ? 'rotate(180deg)' : 'rotate(0deg)',
                        })}
                      />
                    </button>
                  </div>
                </div>
                {/* details */}
                <div
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    overflow:
                      routeDetail.passStations.length === 0 || toggleDetailRoute[routeDetailIdx] ? 'visible' : 'hidden',
                    height: routeDetail.passStations.length === 0 || toggleDetailRoute[routeDetailIdx] ? 'auto' : '0px',
                  })}
                >
                  {routeDetail.passStations.map((stationName) => (
                    <div className={css({ display: 'flex', gap: '12px' })}>
                      <div
                        className={css({
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        })}
                      >
                        <span
                          style={{ borderColor: routeDetail.lineColor }}
                          className={css({
                            position: 'relative',
                            border: '1px solid',
                            width: '8px',
                            height: '8px',
                            borderRadius: 'full',
                            display: 'block',
                          })}
                        >
                          <span
                            style={{ backgroundColor: routeDetail.lineColor }}
                            className={css({
                              position: 'absolute',
                              height: '16px',
                              width: '1px',
                              top: 'calc(100% + 4px)',
                              left: '50%',
                            })}
                          />
                        </span>
                      </div>
                      <p className={css({ color: '#4D525A', fontSize: '14px' })}>{stationName}</p>
                    </div>
                  ))}
                </div>
              </>
            ))}
            <p className={css({ paddingLeft: '36px', color: '#23272B', fontWeight: 'semibold' })}>
              {searchResult.route.stationCongestions.at(-1)!.stationName} 하차
            </p>
          </div>
        </section>
      </div>
      {!isAddedBookmark && (
        <button
          onClick={handleClickAddBookmark}
          className={css({
            height: '50px',
            left: '16px',
            right: '16px',
            bottom: '16px',
            position: 'absolute',
            backgroundColor: '#00F5A0',
            color: '#23272B',
            fontWeight: 'medium',
            borderRadius: '12px',
          })}
        >
          즐겨찾기 추가하기
        </button>
      )}
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
                  className={css({ height: '48px', outline: 'none' })}
                  maxLength={10}
                  value={bookmarkName}
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
