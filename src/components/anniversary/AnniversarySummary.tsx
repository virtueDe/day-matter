import type { AnniversarySummaryView } from '../../features/anniversaries/types';

interface AnniversarySummaryProps {
  summary: AnniversarySummaryView;
}

export function AnniversarySummary({ summary }: AnniversarySummaryProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">纪念日 Daymark</p>
        <h1 className="hero__title" id="hero-title">
          让重要的日子，不只被记住一次。
        </h1>
        <p className="hero__copy">{summary.heroMessage}</p>
      </div>
      <div className="hero__metrics">
        <article className="metric-card">
          <span className="metric-card__label">总记录数</span>
          <strong className="metric-card__value">{summary.totalCount}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">今天正在纪念</span>
          <strong className="metric-card__value">{summary.todayCount}</strong>
        </article>
        <article className="metric-card metric-card--wide">
          <span className="metric-card__label">最近的周年</span>
          <strong className="metric-card__value metric-card__value--compact">
            {summary.upcomingRecord ? summary.upcomingRecord.title : '还没有记录'}
          </strong>
          <span className="metric-card__hint">
            {summary.upcomingRecord ? summary.upcomingRecord.countdownLabel : '先创建第一条纪念日'}
          </span>
        </article>
      </div>
    </section>
  );
}
