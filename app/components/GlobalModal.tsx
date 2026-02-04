import AlertModal from './AlertModal';
import ConfirmModal from './ConfirmModal';
import { useGlobalModal } from '~/store/useGlobalModal';

export default function GlobalModal() {
  const { isOpen, content, close } = useGlobalModal();

  if (!isOpen || !content) return null;

  if (content.type === 'alert') {
    return (
      <AlertModal
        title={content.title}
        description={content.description}
        onConfirm={() => close(true)}
      />
    );
  }

  return (
    <ConfirmModal
      title={content.title}
      description={content.description}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );
}
