import { render } from '@testing-library/react';
import { App } from '../app/App';
import { saveRecords } from '../storage/anniversaryStorage';
import type { AnniversaryRecord } from '../features/anniversaries/types';

export function renderApp(records: AnniversaryRecord[] = []) {
  saveRecords(records, window.localStorage);

  return render(<App />);
}

