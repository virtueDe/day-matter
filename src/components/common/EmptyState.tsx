import { Button } from './Button';

interface EmptyStateProps {
  eyebrow?: string;
  title?: string;
  copy?: string;
  actionLabel?: string;
  onCreateFirst: () => void;
}

export function EmptyState({
  actionLabel = '创建第一条纪念日',
  copy = '只要写下名称和日期，纪念日就会替你算出已经走过多久，以及下一次周年还要等几天。',
  eyebrow = '还没有任何纪念日',
  onCreateFirst,
  title = '让第一个重要日子先住进来',
}: EmptyStateProps) {
  return (
    <section className="empty-state">
      <p className="empty-state__eyebrow">{eyebrow}</p>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__copy">{copy}</p>
      <Button onClick={onCreateFirst}>{actionLabel}</Button>
    </section>
  );
}
