import { useEffect, useMemo, useState, type FormEvent, type RefObject } from 'react';
import { ANNIVERSARY_CATEGORY_OPTIONS, DEFAULT_ANNIVERSARY_CATEGORY } from '../../features/anniversaries/categories';
import { buildAnniversaryPreview } from '../../features/anniversaries/selectors';
import { getTodayISO, isFutureDate } from '../../lib/date/normalize';
import { validateAnniversaryFormInput } from '../../features/anniversaries/useAnniversaries';
import type { AnniversaryFormErrors, AnniversaryFormInput, AnniversaryRecord } from '../../features/anniversaries/types';
import { AnniversaryPreview } from './AnniversaryPreview';
import { Button } from '../common/Button';
import { DateField } from '../common/DateField';
import { InlineMessage } from '../common/InlineMessage';
import { SelectField } from '../common/SelectField';
import { TextField } from '../common/TextField';

interface AnniversaryFormProps {
  editingRecord: AnniversaryRecord | null;
  titleInputRef: RefObject<HTMLInputElement | null>;
  onCancelEdit: () => void;
  onSubmit: (input: AnniversaryFormInput) => void;
}

const EMPTY_FORM: AnniversaryFormInput = {
  title: '',
  baseDateISO: '',
  category: DEFAULT_ANNIVERSARY_CATEGORY,
};

export function AnniversaryForm({
  editingRecord,
  onCancelEdit,
  onSubmit,
  titleInputRef,
}: AnniversaryFormProps) {
  const [formState, setFormState] = useState<AnniversaryFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<AnniversaryFormErrors>({});

  useEffect(() => {
    if (editingRecord) {
      setFormState({
        title: editingRecord.title,
        baseDateISO: editingRecord.baseDateISO,
        category: editingRecord.category,
      });
      setErrors({});
      return;
    }

    setFormState(EMPTY_FORM);
    setErrors({});
  }, [editingRecord]);

  const isEditing = Boolean(editingRecord);
  const preview = useMemo(() => buildAnniversaryPreview(formState), [formState]);
  const previewStatus = formState.baseDateISO && isFutureDate(formState.baseDateISO) ? 'invalid' : 'idle';

  function handleChange<Key extends keyof AnniversaryFormInput>(key: Key, value: AnniversaryFormInput[Key]) {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAnniversaryFormInput(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      title: formState.title.trim(),
      baseDateISO: formState.baseDateISO,
      category: formState.category,
    });

    if (!isEditing) {
      setFormState(EMPTY_FORM);
    }
  }

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <p className="panel__eyebrow">{isEditing ? '编辑纪念日' : '写下一个日子'}</p>
      <h2 className="panel__title" id="form-title">
        {isEditing ? '修正它，让时间继续准确流动' : '名称和日期就够了，剩下的交给时间'}
      </h2>
      <form className="form" noValidate onSubmit={handleSubmit}>
        <div className="form__grid">
          <TextField
            ref={titleInputRef}
            autoComplete="off"
            error={errors.title}
            id="anniversary-title"
            label="纪念日名称"
            maxLength={40}
            name="title"
            placeholder="比如：第一次见面"
            value={formState.title}
            onChange={(event) => handleChange('title', event.currentTarget.value)}
          />
          <DateField
            error={errors.baseDateISO}
            id="anniversary-date"
            label="纪念日期"
            max={getTodayISO()}
            name="baseDateISO"
            value={formState.baseDateISO}
            onChange={(event) => handleChange('baseDateISO', event.currentTarget.value)}
          />
          <SelectField
            id="anniversary-category"
            label="纪念日分类"
            name="category"
            options={ANNIVERSARY_CATEGORY_OPTIONS}
            value={formState.category}
            onChange={(event) => handleChange('category', event.currentTarget.value as AnniversaryFormInput['category'])}
          />
        </div>
        <AnniversaryPreview preview={preview} status={previewStatus} />
        <InlineMessage>首版只支持过去或今天的日期，默认按最近周年自动排序。</InlineMessage>
        <div className="form__actions">
          {isEditing ? (
            <Button variant="secondary" onClick={onCancelEdit}>
              取消编辑
            </Button>
          ) : null}
          <Button fullWidth={!isEditing} type="submit">
            {isEditing ? '保存修改' : '保存纪念日'}
          </Button>
        </div>
      </form>
    </section>
  );
}
