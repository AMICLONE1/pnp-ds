import { toast as sonnerToast } from 'sonner';

/**
 * Toast notification utilities
 * Usage: import { toast } from '@/lib/toast'
 */

export const toast = {
  /**
   * Show a success message
   * @example toast.success('Capacity reserved successfully!')
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error message
   * @example toast.error('Failed to process payment')
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show an info message
   * @example toast.info('Your session will expire in 5 minutes')
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning message
   * @example toast.warning('Please connect your utility provider')
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a loading message
   * @example const loadingId = toast.loading('Processing payment...')
   * @returns Toast ID to dismiss later
   */
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  /**
   * Show a promise-based toast
   * @example
   * toast.promise(
   *   createReservation(),
   *   {
   *     loading: 'Creating reservation...',
   *     success: 'Reservation created!',
   *     error: 'Failed to create reservation'
   *   }
   * )
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  /**
   * Dismiss a specific toast
   * @example toast.dismiss(loadingId)
   */
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },

  /**
   * Show a custom toast with action button
   * @example
   * toast.custom('Profile updated', {
   *   action: {
   *     label: 'View Profile',
   *     onClick: () => router.push('/profile')
   *   }
   * })
   */
  custom: (
    message: string,
    options?: {
      description?: string;
      action?: {
        label: string;
        onClick: () => void;
      };
      cancel?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    return sonnerToast(message, {
      description: options?.description,
      action: options?.action,
      cancel: options?.cancel,
      duration: 4000,
    });
  },
};
