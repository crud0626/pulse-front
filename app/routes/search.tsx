import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { format, isToday } from 'date-fns';
import { css } from 'styled-system/css';

import VerticalChangeIcon from '~/assets/vertical-change.svg?react';
import TrainIcon from '~/assets/train.svg?react';
import SecondSearchFormSection from '~/components/SecondSearchFormSection';

interface KeywordSearchContent {
  stationName: string;
  stationID: string;
  x: number;
  y: number;
  laneName: string;
  lineColor: string;
}

const MOCK_KEYWORD_RESULT: {
  totalCount: number;
  stations: KeywordSearchContent[];
} = {
  'totalCount': 9,
  'stations': [
    {
      'stationName': '서울대벤처타운',
      'stationID': '11720',
      'x': 126.933892,
      'y': 37.472059,
      'laneName': '수도권 신림선',
      'lineColor': '#A1C639',
    },
    {
      'stationName': '서울대입구',
      'stationID': '228',
      'x': 126.952729,
      'y': 37.481207,
      'laneName': '수도권 2호선',
      'lineColor': '#3CB44B',
    },
    {
      'stationName': '서울숲',
      'stationID': '1511',
      'x': 127.04469,
      'y': 37.543654,
      'laneName': '수도권 수인.분당선',
      'lineColor': '#F5A623',
    },
    {
      'stationName': '서울역',
      'stationID': '133',
      'x': 126.972317,
      'y': 37.555946,
      'laneName': '수도권 1호선',
      'lineColor': '#0052A4',
    },
    {
      'stationName': '서울역',
      'stationID': '426',
      'x': 126.972713,
      'y': 37.553514,
      'laneName': '수도권 4호선',
      'lineColor': '#00A4E3',
    },
    {
      'stationName': '서울역',
      'stationID': '1610',
      'x': 126.971333,
      'y': 37.556407,
      'laneName': '경의중앙선',
      'lineColor': '#73C7A6',
    },
    {
      'stationName': '서울역',
      'stationID': '4001',
      'x': 126.969775,
      'y': 37.553744,
      'laneName': '수도권 공항철도',
      'lineColor': '#5B9BD5',
    },
    {
      'stationName': '서울역',
      'stationID': '9116',
      'x': 126.972616,
      'y': 37.555474,
      'laneName': '수도권 GTX-A',
      'lineColor': '#9B59B6',
    },
    {
      'stationName': '서울지방병무청',
      'stationID': '11713',
      'x': 126.922594,
      'y': 37.505772,
      'laneName': '수도권 신림선',
      'lineColor': '#D35400',
    },
  ],
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [selectedStation, setSelectedStation] = useState<{
    start: null | KeywordSearchContent;
    end: null | KeywordSearchContent;
  }>({
    start: null,
    end: null,
  });

  const [searchResult, setSearchResult] = useState<KeywordSearchContent[]>([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState<null | 0 | 1>(null);
  const [focusedInput, setFocusedInput] = useState<null | 'start' | 'end'>(null);
  const [inputValue, setInputValue] = useState({
    start: '',
    end: '',
  });
  const [departureTimeRange, setDepartureTimeRange] = useState<Record<'min' | 'max', null | string>>({
    min: null,
    max: null,
  });

  const handleChangeTimeRange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setDepartureTimeRange({
        min: value,
        max: null,
      });
      return;
    }

    setDepartureTimeRange((prev) => ({
      ...prev,
      max: value,
    }));
  };

  const handleChangeDate = (willChangeDate?: Date) => {
    if (willChangeDate && isToday(willChangeDate)) {
      setDepartureTimeRange({
        min: null,
        max: null,
      });
    }

    setSelectedDate(willChangeDate);
  };

  const handleSearch = () => {
    {
      if (
        !selectedStation.start ||
        !selectedStation.end ||
        !selectedDate ||
        !departureTimeRange.min ||
        !departureTimeRange.max
      )
        return;

      const searchResultUrl = new URL('/search/results', window.location.origin);
      searchResultUrl.searchParams.set('departureStationId', selectedStation.start.stationID);
      searchResultUrl.searchParams.set('arrivalStationId', selectedStation.end.stationID);
      searchResultUrl.searchParams.set('searchDate', format(selectedDate, 'yyyy-MM-dd'));
      searchResultUrl.searchParams.set('startTime', departureTimeRange.min);
      searchResultUrl.searchParams.set('endTime', departureTimeRange.max);

      navigate(searchResultUrl.pathname + searchResultUrl.search);
    }
  };

  useEffect(() => {
    setSearchResult([]);
  }, [focusedInput]);

  useEffect(() => {
    if (focusedInput === null || !inputValue[focusedInput]) {
      setSearchResult([]);
      return;
    }

    // TODO :: 검색 API 요청 연결
    setSearchResult(MOCK_KEYWORD_RESULT.stations);
  }, [inputValue, focusedInput]);

  const isSearchDisabled =
    selectedStation.start === null ||
    selectedStation.end === null ||
    !selectedDate ||
    departureTimeRange.min === null ||
    departureTimeRange.max === null;

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
          <img src='/icons/close.png' alt='' className={css({ width: '24px', height: '24px' })} />
        </button>
      </header>
      <div
        className={css({
          paddingX: '16px',
          paddingTop: '8px',
          paddingBottom: '16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflow: 'hidden',
        })}
      >
        <section
          className={css({ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' })}
        >
          {/* 검색 */}
          <details
            open={isOpenCollapse === 0}
            name='accordion'
            className={css({
              flexShrink: 0,
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              _open: {
                flexGrow: 1,
                flexShrink: 1,
              },
            })}
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                setIsOpenCollapse((prev) => (prev === 0 ? null : 0));
              }}
              className={css({
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              })}
            >
              {isOpenCollapse !== 0 && selectedStation.start && selectedStation.end ? (
                <div
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    })}
                  >
                    <span
                      style={{ backgroundColor: selectedStation.start.lineColor }}
                      className={css({ width: '10px', height: '10px', borderRadius: 'full' })}
                    />
                    <p className={css({ color: '#23272B' })}>{selectedStation.start.stationName}</p>
                  </div>
                  <div
                    className={css({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    })}
                  >
                    <span
                      style={{ backgroundColor: selectedStation.end.lineColor }}
                      className={css({ width: '10px', height: '10px', borderRadius: 'full' })}
                    />
                    <p className={css({ color: '#23272B' })}>{selectedStation.end.stationName}</p>
                  </div>
                </div>
              ) : (
                <p
                  className={css({
                    fontSize: '18px',
                    fontWeight: 'semibold',
                    color: '#23272B',
                  })}
                >
                  검색
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
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              })}
            >
              {/* 인풋s */}
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                })}
              >
                <div
                  className={css({
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
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
                        backgroundImage:
                          'linear-gradient(#fff, #fff), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: '0 2px 8px rgb(35 39 43/ 0.1)',
                      },
                    })}
                  >
                    {selectedStation.start && (
                      <span
                        style={{
                          backgroundColor: selectedStation.start.lineColor,
                        }}
                        className={css({
                          flexShrink: 0,
                          display: 'block',
                          width: '10px',
                          height: '10px',
                          borderRadius: 'full',
                        })}
                      />
                    )}
                    <input
                      type='text'
                      name='start'
                      placeholder='출발지 검색'
                      value={inputValue.start}
                      className={css({ flexGrow: 1, flexShrink: 1, minWidth: 0, outline: 'none' })}
                      onFocus={() => setFocusedInput('start')}
                      onBlur={() => {
                        const { start } = selectedStation;

                        if (start) {
                          setInputValue((prev) => ({
                            ...prev,
                            start: start.stationName,
                          }));
                        }
                      }}
                      onChange={(event) => {
                        const changedValue = event.currentTarget.value;

                        if (!changedValue) {
                          setSelectedStation((prev) => ({
                            ...prev,
                            start: null,
                          }));
                        }

                        setInputValue((prev) => ({
                          ...prev,
                          start: changedValue,
                        }));
                      }}
                    />
                    <button
                      className={css({
                        flexShrink: 0,
                        visibility: focusedInput === 'start' ? 'visible' : 'hidden',
                      })}
                      onClick={() => {
                        setSelectedStation((prev) => ({
                          ...prev,
                          start: null,
                        }));
                        setInputValue((prev) => ({
                          ...prev,
                          start: '',
                        }));
                      }}
                    >
                      <img
                        src='/icons/close-circle.png'
                        alt=''
                        className={css({
                          flexShrink: 0,
                          width: '18px',
                          height: '18px',
                          objectFit: 'cover',
                        })}
                      />
                    </button>
                  </div>
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
                        backgroundImage:
                          'linear-gradient(#fff, #fff), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: '0 2px 8px rgb(35 39 43/ 0.1)',
                      },
                    })}
                  >
                    {selectedStation.end && (
                      <span
                        style={{
                          backgroundColor: selectedStation.end.lineColor,
                        }}
                        className={css({
                          display: 'block',
                          width: '10px',
                          height: '10px',
                          borderRadius: 'full',
                        })}
                      />
                    )}
                    <input
                      type='text'
                      name='end'
                      placeholder='도착지 검색'
                      className={css({ flexGrow: 1, flexShrink: 1, minWidth: 0, outline: 'none' })}
                      onFocus={() => setFocusedInput('end')}
                      onBlur={() => {
                        const { end } = selectedStation;

                        if (end) {
                          setInputValue((prev) => ({
                            ...prev,
                            end: end.stationName,
                          }));
                        }
                      }}
                      value={inputValue.end}
                      onChange={(event) => {
                        const changedValue = event.currentTarget.value;

                        if (!changedValue) {
                          setSelectedStation((prev) => ({
                            ...prev,
                            end: null,
                          }));
                        }

                        setInputValue((prev) => ({
                          ...prev,
                          end: changedValue,
                        }));
                      }}
                    />
                    <button
                      className={css({
                        visibility: focusedInput === 'end' ? 'visible' : 'hidden',
                      })}
                      onClick={() => {
                        setSelectedStation((prev) => ({
                          ...prev,
                          end: null,
                        }));

                        setInputValue((prev) => ({
                          ...prev,
                          end: '',
                        }));
                      }}
                    >
                      <img
                        src='/icons/close-circle.png'
                        alt=''
                        className={css({
                          width: '18px',
                          height: '18px',
                        })}
                      />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!selectedStation.start && !selectedStation.end) return;

                    setSelectedStation((prev) => ({
                      start: prev.end,
                      end: prev.start,
                    }));
                    setInputValue((prev) => ({
                      start: prev.end,
                      end: prev.start,
                    }));
                  }}
                >
                  <VerticalChangeIcon color='#000' />
                </button>
              </div>
              <div>
                {searchResult.map(({ stationID, stationName, x, y, laneName, lineColor }) => (
                  <button
                    key={stationID}
                    className={css({
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingY: '8px',
                      _hover: {
                        backgroundColor: '#E7EAED',
                      },
                    })}
                    onClick={() => {
                      if (focusedInput === null) return;

                      setInputValue((prev) => ({
                        ...prev,
                        [focusedInput]: stationName,
                      }));

                      setSelectedStation((prev) => ({
                        ...prev,
                        [focusedInput]: {
                          stationID,
                          stationName,
                          x,
                          y,
                          laneName,
                          lineColor,
                        },
                      }));
                    }}
                  >
                    <TrainIcon className={css({ flexShrink: 0 })} />
                    <div
                      className={css({
                        flexGrow: 1,
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      })}
                    >
                      <p
                        className={css({
                          fontSize: '14px',
                          fontWeight: 'semibold',
                        })}
                      >
                        {stationName}
                      </p>
                      <p
                        style={{ backgroundColor: lineColor }}
                        className={css({
                          paddingX: '4px',
                          paddingY: '2px',
                          borderRadius: 'full',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 'normal',
                        })}
                      >
                        {laneName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </details>
          {/* 날짜 & 시간 입력 인풋 섹션 */}
          <SecondSearchFormSection
            isOpenSection={isOpenCollapse === 1}
            selectedDate={selectedDate}
            departureTimeRange={departureTimeRange}
            toggleSection={() => setIsOpenCollapse((prev) => (prev === 1 ? null : 1))}
            onSelectDate={handleChangeDate}
            onChangeTimeRange={handleChangeTimeRange}
          />
        </section>
        <button
          disabled={isSearchDisabled}
          onClick={handleSearch}
          className={css({
            flexShrink: 0,
            height: '50px',
            backgroundColor: '#23272B',
            color: '#FFFFFF',
            borderRadius: '12px',
            _disabled: {
              backgroundColor: '#BBC1C9',
              cursor: 'not-allowed',
            },
          })}
        >
          검색하기
        </button>
      </div>
    </main>
  );
}
