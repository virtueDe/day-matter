export interface AnniversaryRecord {
  id: string;
  title: string;
  baseDateISO: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface AnniversaryStoreV1 {
  version: 1;
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
  createdAtISO: string;
  updatedAtISO: string;
  formattedBaseDate: string;
  elapsedLabel: string;
  countdownLabel: string;
  anniversaryLabel: string;
  highlightLevel: 'today' | 'soon' | 'normal';
}

export interface AnniversarySummaryView {
  totalCount: number;
  upcomingRecord: AnniversaryView | null;
  todayCount: number;
  heroMessage: string;
}

export interface AnniversaryFormInput {
  title: string;
  baseDateISO: string;
}

export interface AnniversaryFormErrors {
  title?: string;
  baseDateISO?: string;
}

