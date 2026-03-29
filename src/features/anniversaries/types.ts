export type AnniversaryCategory =
  | 'relationship'
  | 'family'
  | 'career'
  | 'pet'
  | 'life'
  | 'other'
  | 'uncategorized';

export type AnniversaryArchiveFilter = 'active' | 'archived' | 'all';

export interface AnniversaryRecord {
  id: string;
  title: string;
  baseDateISO: string;
  category: AnniversaryCategory;
  archivedAtISO: string | null;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface AnniversaryRecordV1 {
  id: string;
  title: string;
  baseDateISO: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface AnniversaryStoreV1 {
  version: 1;
  records: AnniversaryRecordV1[];
}

export interface AnniversaryStoreV2 {
  version: 2;
  records: AnniversaryRecord[];
}

export interface AnniversaryMetrics {
  elapsedDays: number;
  completedYears: number;
  nextAnniversaryISO: string;
  daysUntilNext: number;
  isToday: boolean;
}

export interface AnniversaryView extends AnniversaryMetrics {
  id: string;
  title: string;
  baseDateISO: string;
  category: AnniversaryCategory;
  archivedAtISO: string | null;
  createdAtISO: string;
  updatedAtISO: string;
  formattedBaseDate: string;
  categoryLabel: string;
  elapsedLabel: string;
  countdownLabel: string;
  anniversaryLabel: string;
  isArchived: boolean;
  highlightLevel: 'today' | 'soon' | 'normal';
}

export interface AnniversarySummaryView {
  spotlightRecord: AnniversaryView | null;
  activeCount: number;
  archivedCount: number;
  visibleCount: number;
  upcomingCount: number;
  heroMessage: string;
  scopeLabel: string;
  categoryBreakdown: Array<{
    category: AnniversaryCategory;
    label: string;
    count: number;
  }>;
}

export interface AnniversaryPreviewView {
  title: string;
  category: AnniversaryCategory;
  categoryLabel: string;
  formattedBaseDate: string;
  elapsedLabel: string;
  countdownLabel: string;
  anniversaryLabel: string;
}

export interface AnniversaryFormInput {
  title: string;
  baseDateISO: string;
  category: AnniversaryCategory;
}

export interface AnniversaryFormErrors {
  title?: string;
  baseDateISO?: string;
}

export interface AnniversaryFilterState {
  archive: AnniversaryArchiveFilter;
  category: AnniversaryCategory | 'all';
}
