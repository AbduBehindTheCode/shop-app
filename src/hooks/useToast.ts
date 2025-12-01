import { useCallback, useState } from 'react';
import { ToastType } from '../components/ui/Toast';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  actionText?: string;
  onActionPress?: () => void;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((
    message: string,
    type: ToastType = 'success',
    actionText?: string,
    onActionPress?: () => void
  ) => {
    setToast({
      visible: true,
      message,
      type,
      actionText,
      onActionPress,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
