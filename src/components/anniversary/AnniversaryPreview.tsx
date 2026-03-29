import type { AnniversaryPreviewView } from '../../features/anniversaries/types';

interface AnniversaryPreviewProps {
  preview: AnniversaryPreviewView | null;
  status: 'idle' | 'invalid';
}

export function AnniversaryPreview({ preview, status }: AnniversaryPreviewProps) {
  if (!preview) {
    return (
      <section className={`preview-card ${status === 'invalid' ? 'preview-card--invalid' : ''}`} aria-live="polite">
        <p className="preview-card__eyebrow">草稿预览</p>
        <h3 className="preview-card__title">
          {status === 'invalid' ? '这个日期现在还不能生成预览' : '填好名称、日期和分类后，这里会先替你演算一遍'}
        </h3>
        <p className="preview-card__copy">
          {status === 'invalid'
            ? '未来日期暂不在当前版本支持范围内，所以不会展示成功态结果。'
            : '预览不会写入存储，只是帮你确认这个日子有没有填对。'}
        </p>
      </section>
    );
  }

  return (
    <section className="preview-card" aria-live="polite">
      <div className="preview-card__header">
        <div>
          <p className="preview-card__eyebrow">草稿预览</p>
          <h3 className="preview-card__title">{preview.title}</h3>
        </div>
        <span className="badge">{preview.categoryLabel}</span>
      </div>
      <p className="preview-card__date">{preview.formattedBaseDate}</p>
      <div className="preview-card__metrics">
        <div>
          <p className="preview-card__metric-label">已经过去</p>
          <p className="preview-card__metric-copy">{preview.elapsedLabel}</p>
        </div>
        <div>
          <p className="preview-card__metric-label">下一次周年</p>
          <p className="preview-card__metric-copy">{preview.countdownLabel}</p>
        </div>
      </div>
      <p className="preview-card__footer">{preview.anniversaryLabel}</p>
    </section>
  );
}
