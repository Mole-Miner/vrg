import { Routes } from '@angular/router';

import { FileReaderService } from './services/file-reader.service';
import { ReportService } from './services/report.service';
import { reportResolver } from './resolvers/report.resolver';

export default [
  {
    path: 'import',
    loadComponent: () =>
      import('./import/import.component').then((m) => m.ImportComponent)
  },
  {
    path: 'editor',
    providers: [FileReaderService, ReportService],
    resolve: {
      report: reportResolver
    },
    loadComponent: () =>
      import('./editor/editor.component').then((m) => m.EditorComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'import'
  }
] as Routes;
