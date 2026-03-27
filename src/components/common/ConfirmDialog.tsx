import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, onCancel, onConfirm }: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      cancelButtonRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <div aria-labelledby="confirm-dialog-title" aria-modal="true" className="dialog" role="dialog">
        <p className="dialog__eyebrow">删除确认</p>
        <h2 className="dialog__title" id="confirm-dialog-title">
          确定删除「{title}」吗？
        </h2>
        <p className="dialog__copy">删除后不会再出现在列表里。首版没有回收站，这一步别点错。</p>
        <div className="dialog__actions">
          <Button ref={cancelButtonRef} variant="secondary" onClick={onCancel}>
            先保留
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            确认删除
          </Button>
        </div>
      </div>
    </div>
  );
}
