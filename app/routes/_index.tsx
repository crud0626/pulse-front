import { useState } from 'react';
import { Link } from 'react-router';
import { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { css } from 'styled-system/css';
import type { Route } from './+types/_index';
import 'swiper/css';
import 'swiper/css/pagination';

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
          <h1>PULSE</h1>
        </Link>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          })}
        >
          <button>
            <img
              src='/icons/calendar-star.png'
              alt=''
              className={css({
                width: '24px',
                height: '24px',
              })}
            />
          </button>
          <button>
            <img
              src='/icons/hamburger.png'
              alt=''
              className={css({
                width: '24px',
                height: '24px',
              })}
            />
          </button>
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
          <Swiper spaceBetween={12} slidesPerView={1.3} className={css({ width: '100%' })}>
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
                      gap: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <div
                      className={css({
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      })}
                    >
                      <img src='/icons/route-start.png' alt='' className={css({ width: '16px', height: '16px' })} />
                      <p
                        className={css({
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        })}
                      >
                        {history.start}
                      </p>
                    </div>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                      <img src='/icons/route-end.png' alt='' className={css({ width: '16px', height: '16px' })} />
                      <p
                        className={css({
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        })}
                      >
                        {history.end}
                      </p>
                    </div>
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
                    <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px' })}>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                        <img src='/icons/route-start.png' alt='' className={css({ width: '16px', height: '16px' })} />
                        <p
                          className={css({
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          })}
                        >
                          {item.start}
                        </p>
                      </div>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                        <img src='/icons/route-end.png' alt='' className={css({ width: '16px', height: '16px' })} />
                        <p
                          className={css({
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          })}
                        >
                          {item.end}
                        </p>
                      </div>
                      <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                        <img src='/icons/clock-black.png' alt='' className={css({ width: '16px', height: '16px' })} />
                        <p
                          className={css({
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          })}
                        >
                          {item.minTime} ~ {item.maxTime} 중 출발
                        </p>
                      </div>
                    </div>
                    <hr className={css({ border: '1px dashed #D3D7DD' })} />
                    {/* 결과 영역 */}
                    <div
                      className={css({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
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
                            alignItems: 'center',
                          })}
                        >
                          <img
                            src='/icons/congestion-best.png'
                            alt=''
                            className={css({ width: '24px', height: '24px' })}
                          />
                          <p className={css({ fontSize: '18px', fontWeight: 'bold' })}>여유로워요</p>
                        </div>
                        <div
                          className={css({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            flexShrink: 1,
                            padding: '2px 6px',
                            backgroundColor: '#23272B',
                            borderRadius: '4px',
                            color: 'white',
                          })}
                        >
                          <p className={css({ fontSize: '14px' })}>12:40 출발</p>
                          <p>·</p>
                          <p className={css({ fontSize: '12px' })}>30분 소요</p>
                        </div>
                      </div>
                      <div>
                        <div
                          className={css({
                            backgroundColor: '#2B54A3',
                            height: '6px',
                            borderRadius: '9999px',
                          })}
                        ></div>
                        <div
                          className={css({
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#9DA3AD',
                          })}
                        >
                          <p>12:40</p>
                          <p>13:00</p>
                        </div>
                      </div>
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
                          <span className={css({ fontWeight: 'bold', color: '#2B54A3' })}>1호선</span> 회기역 승차
                        </p>
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
