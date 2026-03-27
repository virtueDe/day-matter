interface ToastProps {
  message: string;
  tone: 'success' | 'error';
}

export function Toast({ message, tone }: ToastProps) {
  return (
    <div aria-live="polite" className={`toast toast--${tone}`} role="status">
      {message}
    </div>
  );
}

