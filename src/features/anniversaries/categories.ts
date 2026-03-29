import type { AnniversaryCategory } from './types';

export interface AnniversaryCategoryOption {
  value: AnniversaryCategory;
  label: string;
}

export const DEFAULT_ANNIVERSARY_CATEGORY: AnniversaryCategory = 'uncategorized';

export const ANNIVERSARY_CATEGORY_OPTIONS: AnniversaryCategoryOption[] = [
  { value: 'relationship', label: '关系' },
  { value: 'family', label: '家庭' },
  { value: 'career', label: '工作' },
  { value: 'pet', label: '宠物' },
  { value: 'life', label: '生活' },
  { value: 'other', label: '其他' },
  { value: 'uncategorized', label: '未分类' },
];

export function getAnniversaryCategoryLabel(category: AnniversaryCategory): string {
  return ANNIVERSARY_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? '未分类';
}
