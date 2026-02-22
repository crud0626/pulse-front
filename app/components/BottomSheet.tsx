import { css } from 'styled-system/css';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
};

export default function BottomSheet({ isOpen, onClose, header, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className={css({
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(35, 39, 43, 0.35)',
        zIndex: 10,
      })}
      onClick={onClose}
    >
      <div
        className={css({
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        })}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={css({
            height: '48px',
            backgroundColor: 'white',
            borderTopRadius: '24px',
            padding: '12px 16px',
          })}
        >
          {header}
        </div>
        <div className={css({ backgroundColor: 'white' })}>{children}</div>
      </div>
    </div>
  );
}
