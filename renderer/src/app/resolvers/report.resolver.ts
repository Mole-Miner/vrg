import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { concatMap, EMPTY } from 'rxjs';

import { FileReaderService } from '../services/file-reader.service';
import { Report, ReportService } from '../services/report.service';

export const reportResolver: ResolveFn<Report> = () => {
  const router = inject(Router);
  const routerState = router.getCurrentNavigation()?.extras.state;
  const file = routerState ? (routerState['file'] as File) : undefined;
  if (!file) {
    return EMPTY;
  }
  const frService = inject(FileReaderService);
  const reportService = inject(ReportService);
  return frService
    .readFile(file)
    .pipe(concatMap((doc) => reportService.processReport(doc)));
};
