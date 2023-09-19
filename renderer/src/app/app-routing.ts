import { Routes } from "@angular/router";

export default [
  {
    path: 'file',
    loadComponent: () => import('./file/file.component').then((m) => m.FileComponent)
  },
  {
    path: 'report',
    loadComponent: () => import('./report/report.component').then((m) => m.ReportComponent)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'file'
  }
] as Routes;
