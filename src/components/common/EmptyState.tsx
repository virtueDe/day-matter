import { Button } from './Button';

interface EmptyStateProps {
  onCreateFirst: () => void;
}

export function EmptyState({ onCreateFirst }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <p className="empty-state__eyebrow">还没有任何纪念日</p>
      <h2 className="empty-state__title">让第一个重要日子先住进来</h2>
      <p className="empty-state__copy">
        只要写下名称和日期，纪日就会替你算出已经走过多久，以及下一次周年还要等几天。
      </p>
      <Button onClick={onCreateFirst}>创建第一条纪念日</Button>
    </section>
  );
}

