import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Reorder } from 'motion/react';
import { format, parse } from 'date-fns';
import { toast } from 'react-toastify/unstyled';

import { css } from 'styled-system/css';
import { useAuth } from '~/store/useAuth';
import { clientFetcher } from '~/lib/axios/client';
import { useGlobalModal } from '~/store/useGlobalModal';

interface BookmarkContent {
  id: number;
  name: string;
  departureStationId: string;
  arrivalStationId: string;
  departureStationName: string;
  arrivalStationName: string;
  departureLineName: string;
  departureLineColor: string;
  arrivalLineName: string;
  arrivalLineColor: string;
  startTime: string;
  endTime: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const { isLoggedIn } = useAuth();
  const { open } = useGlobalModal();

  const [favorites, setFavorites] = useState<BookmarkContent[]>([]);
  const [orderIdList, setOrderIdList] = useState<number[]>([]);

  const getBookmarkList = async () => {
    try {
      const { data } = await clientFetcher.get<BookmarkContent[]>('/bookmarks');
      setFavorites(data);
    } catch (error) {
      toast('즐겨찾기 리스트를 가져오지 못했습니다.');
    }
  };

  const onChangeOrder = async () => {
    try {
      const nextFavorites = orderIdList
        .map((orderId) => favorites.find((favoriteItem) => favoriteItem.id === orderId))
        .filter((item) => item !== undefined)
        .map((item, displayOrder) => ({ bookmarkId: item.id, newDisplayOrder: displayOrder }));

      await clientFetcher.put<string>('/bookmarks/reorder', {
        items: nextFavorites,
      });

      setIsEditMode(false);
    } catch (error) {
      toast('에러가 발생하였습니다.');
    }
  };

  const handleDeleteAllBookmark = async () => {
    try {
      const isConfirmed = await open({
        type: 'confirm',
        title: '즐겨찾기 내역을 전체삭제할까요?',
        description: '삭제하면 다시 복구할 수 없으니 신중히 결정해 주세요.',
      });

      if (!isConfirmed) return;

      await clientFetcher.delete('/bookmarks');
      await getBookmarkList();
      setIsEditMode(false);
      toast('즐겨찾기 리스트가 전부 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      toast('에러가 발생하였습니다.');
    }
  };

  useEffect(() => {
    setOrderIdList(favorites.map((item) => item.id));
  }, [favorites]);

  useEffect(() => {
    // TODO :: delay 문제 해결 필요 (사용자가 실제 로그인이 되어 있어도, 새로 고침이나 URL로 직접 접근 시, 사용자 정보 받아 온 뒤 변경되는 이유로, 딜레이가 발생해 로그인 유저라도 메인으로 이동됨)
    // if (!isLoggedIn) {
    //   navigate('/login');
    //   return;
    // }

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
              <img src='/icons/close.png' alt='' className={css({ width: '24px', height: '24px' })} />
            </button>
            <button onClick={handleDeleteAllBookmark}>
              <img src='/icons/cleaning.png' alt='' className={css({ width: '24px', height: '24px' })} />
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate(-1)}>
              <img
                src='/icons/chevron.png'
                alt=''
                className={css({ width: '24px', height: '24px', transform: 'rotate(90deg)' })}
              />
            </button>
            <p>즐겨찾기 목록</p>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '12px' })}>
              <button
                onClick={() => {
                  setIsEditMode(true);
                }}
              >
                <img src='/icons/layers.png' alt='' className={css({ width: '24px', height: '24px' })} />
              </button>
              {/* TODO :: 즐겨찾기 등록 페이지 추가 후 수정 */}
              <button>
                <img src='/icons/add.png' alt='' className={css({ width: '24px', height: '24px' })} />
              </button>
            </div>
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
                        cursor: 'pointer',
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
          ) : favorites.length === 0 ? (
            <div
              className={css({
                margin: 'auto',
                width: '178px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
              })}
            >
              <div className={css({ display: 'flex', flexDir: 'column', gap: '12px' })}>
                <img src='/icons/empty-bookmark.png' alt='' />
                <p className={css({ color: '#4D525A', fontWeight: 'medium' })}>등록된 즐겨찾기가 없습니다.</p>
              </div>
              {/* TODO :: 즐겨찾기 등록 페이지 추가 된 후, click handler 할당 */}
              <button
                className={css({
                  padding: '10px 16px',
                  backgroundColor: '#00F5A0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                })}
              >
                <img src='/icons/add.png' alt='' className={css({ width: '24px', height: '24px' })} />
                <p className={css({ color: '#23272B' })}>등록하기</p>
              </button>
            </div>
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
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                      <span
                        style={{ backgroundColor: favorite.departureLineColor }}
                        className={css({ width: '10px', height: '10px', rounded: 'full' })}
                      />
                      <p
                        className={css({ color: '#23272B', fontSize: '14px' })}
                      >{`${favorite.departureStationName} ${favorite.departureLineName}`}</p>
                    </div>
                    <img
                      src='/icons/chevron.png'
                      alt=''
                      className={css({ width: '18px', height: '18px', transform: 'rotate(-90deg)' })}
                    />
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}>
                      <span
                        style={{ backgroundColor: favorite.arrivalLineColor }}
                        className={css({ width: '10px', height: '10px', rounded: 'full' })}
                      />
                      <p
                        className={css({ color: '#23272B', fontSize: '14px' })}
                      >{`${favorite.arrivalStationName} ${favorite.arrivalLineName}`}</p>
                    </div>
                  </div>
                  <p className={css({ color: '#23272B', fontSize: '14px' })}>
                    {format(parse(favorite.startTime, 'HH:mm', new Date()), 'HH:mm')} ~{' '}
                    {format(parse(favorite.endTime, 'HH:mm', new Date()), 'HH:mm')} 중 출발
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
