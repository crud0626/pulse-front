import { useMemo, useState } from 'react';
import { css } from 'styled-system/css';
import { Reorder } from 'motion/react';

export default function BookmarksPage() {
  const [isEditMode, setIsEditMode] = useState(false);

  // MOCKING
  const [favorites, setFavorites] = useState([
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

  const orderIds = useMemo(() => favorites.map((favorite) => favorite.id), [favorites]);

  const [orderIdList, setOrderIdList] = useState(orderIds);

  // TODO :: API 연동 필요
  const onChangeOrder = () => {
    const nextFavorites = orderIdList
      .map((orderId) => favorites.find((favoriteItem) => favoriteItem.id === orderId))
      .filter((item) => item !== undefined);

    setFavorites(nextFavorites);
    setIsEditMode(false);
  };

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
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                setIsEditMode(false);
              }}
            >
              닫기
            </button>
            <button>삭제</button>
          </>
        ) : (
          <>
            <button>이전</button>
            <p>즐겨찾기 목록</p>
            <button
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              편집
            </button>
          </>
        )}
      </header>
      <div
        className={css({
          position: 'relative',
          paddingX: '16px',
          paddingTop: '8px',
          paddingBottom: '16px',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
        })}
      >
        <section
          className={css({
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          })}
        >
          {isEditMode ? (
            <>
              <Reorder.Group
                values={orderIdList}
                onReorder={setOrderIdList}
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  paddingBottom: '40px',
                })}
              >
                {orderIdList.map((orderId) => {
                  const favorite = favorites.find((favorite) => favorite.id === orderId);

                  if (!favorite) return;

                  return (
                    <Reorder.Item
                      value={favorite.id}
                      key={favorite.id}
                      className={css({
                        background: 'white',
                        borderRadius: '20px',
                        padding: '16px',
                        display: 'flex',
                        gap: '8px',
                      })}
                      whileDrag={{
                        border: '1px solid transparent',
                        backgroundImage:
                          'linear-gradient(#F5F7F9, #F5F7F9), linear-gradient(90deg, #00F5A0 0%, #00D9F5 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        boxShadow: '0 4px 16px rgb(35, 39, 43 / 0.2)',
                        cursor: 'grabbing',
                      }}
                    >
                      <img
                        src='/icons/check-badge.png'
                        alt=''
                        className={css({ width: '24px', height: '24px', flexGrow: 0, flexShrink: 1 })}
                      />
                      <p className={css({ flexGrow: 1, fontSize: '18px', fontWeight: 'semibold', color: '#23272B' })}>
                        {favorite.name}
                      </p>
                      <img
                        src='/icons/draggable.png'
                        alt=''
                        className={css({ width: '24px', height: '24px', flexGrow: 0, flexShrink: 1 })}
                      />
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
              <button
                onClick={onChangeOrder}
                className={css({
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: '#23272B',
                  color: 'white',
                  height: '50px',
                  borderRadius: '12px',
                })}
              >
                완료하기
              </button>
            </>
          ) : (
            favorites.map((favorite) => (
              <div
                key={favorite.id}
                className={css({
                  background: 'white',
                  borderRadius: '20px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                })}
              >
                <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                  <img
                    src='/icons/check-badge.png'
                    alt=''
                    className={css({ width: '24px', height: '24px', flexGrow: 0, flexShrink: 1 })}
                  />
                  <p className={css({ flexGrow: 1, fontSize: '20px', color: '#23272B', fontWeight: 'bold' })}>
                    {favorite.name}
                  </p>
                  <button className={css({ flexGrow: 0, flexShrink: 1, fontSize: '14px', color: '#646973' })}>
                    상세보기
                  </button>
                </div>
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '10px' })}>
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                    <img src='/icons/route-start.png' alt='' className={css({ width: '16px', height: '16px' })} />
                    <p className={css({ color: '#23272B', fontSize: '14px' })}>{favorite.start}</p>
                  </div>
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                    <img src='/icons/route-end.png' alt='' className={css({ width: '16px', height: '16px' })} />
                    <p className={css({ color: '#23272B', fontSize: '14px' })}>{favorite.end}</p>
                  </div>
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                    <img src='/icons/clock-black.png' alt='' className={css({ width: '16px', height: '16px' })} />
                    <p className={css({ color: '#23272B', fontSize: '14px' })}>
                      {favorite.minTime} ~ {favorite.maxTime} 중 출발
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
