import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'react-day-picker/locale';
import { css } from 'styled-system/css';

import VerticalChange from '~/assets/vertical-change.svg?react';
import TrainIcon from '~/assets/train.svg?react';

const MOCK_KEYWORD_RESULT = {
  'totalCount': 9,
  'stations': [
    {
      'stationName': '서울대벤처타운',
      'stationID': '11720',
      'x': 126.933892,
      'y': 37.472059,
      'laneName': '수도권 신림선',
    },
    {
      'stationName': '서울대입구',
      'stationID': '228',
      'x': 126.952729,
      'y': 37.481207,
      'laneName': '수도권 2호선',
    },
    {
      'stationName': '서울숲',
      'stationID': '1511',
      'x': 127.04469,
      'y': 37.543654,
      'laneName': '수도권 수인.분당선',
    },
    {
      'stationName': '서울역',
      'stationID': '133',
      'x': 126.972317,
      'y': 37.555946,
      'laneName': '수도권 1호선',
    },
    {
      'stationName': '서울역',
      'stationID': '426',
      'x': 126.972713,
      'y': 37.553514,
      'laneName': '수도권 4호선',
    },
    {
      'stationName': '서울역',
      'stationID': '1610',
      'x': 126.971333,
      'y': 37.556407,
      'laneName': '경의중앙선',
    },
    {
      'stationName': '서울역',
      'stationID': '4001',
      'x': 126.969775,
      'y': 37.553744,
      'laneName': '수도권 공항철도',
    },
    {
      'stationName': '서울역',
      'stationID': '9116',
      'x': 126.972616,
      'y': 37.555474,
      'laneName': '수도권 GTX-A',
    },
    {
      'stationName': '서울지방병무청',
      'stationID': '11713',
      'x': 126.922594,
      'y': 37.505772,
      'laneName': '수도권 신림선',
    },
  ],
};

export default function SearchPage() {
  const [selected, setSelected] = useState<Date>();

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
        <button>이전</button>
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
              className={css({
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              })}
            >
              <p
                className={css({
                  fontSize: '18px',
                  fontWeight: 'semibold',
                  color: '#23272B',
                })}
              >
                검색
              </p>
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
                    <img
                      src='/icons/route-start.png'
                      alt=''
                      className={css({
                        width: '16px',
                        height: '16px',
                      })}
                    />
                    <input
                      type='text'
                      name='start'
                      placeholder='출발지 검색'
                      className={css({ minWidth: 0, outline: 'none' })}
                    />
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
                    <img
                      src='/icons/route-end.png'
                      alt=''
                      className={css({
                        width: '16px',
                        height: '16px',
                      })}
                    />
                    <input
                      type='text'
                      name='end'
                      placeholder='도착지 검색'
                      className={css({ minWidth: 0, outline: 'none' })}
                    />
                  </div>
                </div>
                <button>
                  <VerticalChange color='#000' />
                </button>
              </div>
              <div>
                {MOCK_KEYWORD_RESULT.stations.map(({ stationID, stationName, x, y, laneName }) => (
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
                  >
                    <TrainIcon className={css({ flexShrink: 0 })} />
                    <div className={css({ flexGrow: 1, textAlign: 'left' })}>
                      <p
                        className={css({
                          fontSize: '14px',
                          fontWeight: 'semibold',
                        })}
                      >
                        {stationName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </details>
          {/* 날짜 & 시간 입력 인풋 섹션 */}
          <details
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
              className={css({
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              })}
            >
              <p
                className={css({
                  fontSize: '18px',
                  fontWeight: 'semibold',
                  color: '#23272B',
                })}
              >
                최소 출발시간
              </p>
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
              <DayPicker
                hideNavigation
                disabled={{ before: new Date() }}
                numberOfMonths={3}
                locale={ko}
                mode='single'
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </details>
        </section>
        <button
          className={css({
            flexShrink: 0,
            height: '50px',
            backgroundColor: '#23272B',
            color: '#FFFFFF',
            borderRadius: '12px',
          })}
        >
          검색하기
        </button>
      </div>
    </main>
  );
}
