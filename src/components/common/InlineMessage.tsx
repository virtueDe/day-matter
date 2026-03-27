interface InlineMessageProps {
  children: string;
  tone?: 'info' | 'error';
}

export function InlineMessage({ children, tone = 'info' }: InlineMessageProps) {
  return <p className={`inline-message inline-message--${tone}`}>{children}</p>;
}

