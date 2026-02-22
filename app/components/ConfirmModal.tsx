import { css } from 'styled-system/css';

type ConfirmModalProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({ title, description, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div
      className={css({
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(35, 39, 43, 0.35)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
      onClick={onCancel}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '16px',
          minWidth: '280px',
          maxWidth: '320px',
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className={css({
            fontSize: '16px',
            fontWeight: 'bold',
          })}
        >
          {title}
        </h2>
        {description && (
          <p
            className={css({
              fontSize: '14px',
            })}
          >
            {description}
          </p>
        )}
        <button
          className={css({
            flex: 1,
            paddingY: '10px',
            backgroundColor: '#DE3412',
            color: 'white',
            borderRadius: '10px',
          })}
          onClick={onConfirm}
        >
          확인
        </button>
        <button onClick={onCancel} className={css({ fontSize: '14px' })}>
          취소
        </button>
      </div>
    </div>
  );
}
