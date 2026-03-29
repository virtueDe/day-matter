import { useEffect, useState } from 'react';
import type { AnniversarySummaryView } from '../../features/anniversaries/types';
import { formatCurrentDate, formatCurrentTime, formatLunarDate } from '../../lib/date/format';

interface AnniversarySummaryProps {
  summary: AnniversarySummaryView;
}

function useCurrentMoment() {
  const [currentMoment, setCurrentMoment] = useState(() => new Date());

  useEffect(() => {
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      setCurrentMoment(new Date());
      intervalId = window.setInterval(() => {
        setCurrentMoment(new Date());
      }, 60_000);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return currentMoment;
}

export function AnniversarySummary({ summary }: AnniversarySummaryProps) {
  const currentMoment = useCurrentMoment();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <p className="hero__eyebrow">纪念日 Daymark</p>
        <h1 className="hero__title" id="hero-title">
          让重要的日子，被时间温柔记住。
        </h1>
        <p className="hero__copy">{summary.heroMessage}</p>
        <p className="hero__scope">{summary.scopeLabel}</p>
        <p className="hero__meta">
          当前时间 {formatCurrentTime(currentMoment)} · {formatCurrentDate(currentMoment)} · {formatLunarDate(currentMoment)}
        </p>
      </div>
      <div className="hero__metrics">
        <article className="metric-card metric-card--wide">
          <span className="metric-card__label">当前焦点</span>
          <strong className="metric-card__value metric-card__value--compact">
            {summary.spotlightRecord ? summary.spotlightRecord.title : '还没有记录'}
          </strong>
          <span className="metric-card__hint">
            {summary.spotlightRecord ? summary.spotlightRecord.countdownLabel : '先创建第一条纪念日'}
          </span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">当前可见</span>
          <strong className="metric-card__value">{summary.visibleCount}</strong>
          <span className="metric-card__hint">活跃 {summary.activeCount} · 已归档 {summary.archivedCount}</span>
        </article>
        <article className="metric-card">
          <span className="metric-card__label">30 天内将到来</span>
          <strong className="metric-card__value">{summary.upcomingCount}</strong>
          <span className="metric-card__hint">
            {summary.categoryBreakdown[0]
              ? `当前最多的是${summary.categoryBreakdown[0].label} · ${summary.categoryBreakdown[0].count}条`
              : '先写下一条，你的时间册就会开始成形'}
          </span>
        </article>
      </div>
    </section>
  );
}
