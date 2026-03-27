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
        <div className="hero__moment" role="group" aria-label="当前时间信息">
          <div className="hero__moment-item">
            <span className="hero__moment-label">当前时间</span>
            <strong className="hero__moment-value">{formatCurrentTime(currentMoment)}</strong>
          </div>
          <div className="hero__moment-item">
            <span className="hero__moment-label">当前日期</span>
            <strong className="hero__moment-value hero__moment-value--small">
              {formatCurrentDate(currentMoment)}
            </strong>
          </div>
          <div className="hero__moment-item">
            <span className="hero__moment-label">农历</span>
            <strong className="hero__moment-value hero__moment-value--small">
              {formatLunarDate(currentMoment)}
            </strong>
          </div>
        </div>
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
