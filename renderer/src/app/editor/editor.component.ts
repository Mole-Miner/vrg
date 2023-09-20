import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { map, Subject, takeUntil } from 'rxjs';

import { Report, ReportRow, ReportService } from '../services/report.service';
import { CLIPBOARD } from "../injectros/clibboard";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly reportForm = new FormGroup({
    reportRows: new FormArray<
      FormGroup<{
        id: FormControl;
        storage: FormControl;
        product: FormControl;
        delivery: FormControl;
        include: FormControl;
      }>
    >([])
  });

  get reportFormRows() {
    return this.reportForm.controls['reportRows'];
  }

  constructor(
    @Inject(CLIPBOARD) @Optional() private readonly clipboard: Navigator['clipboard'],
    private readonly activatedRoute: ActivatedRoute,
    private readonly reportService: ReportService,
  ) {}

  ngOnInit() {
    const routeData$ = this.activatedRoute.data.pipe(
      map((data) => data['report'] as Report),
      takeUntil(this.destroy$)
    );
    routeData$.subscribe((report: Report) => {
      this.buildReportForm(report);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onExportReport() {
    const report = this.reportFormRows
      .getRawValue()
      .filter(({ include }) => include)
      .map(({ include, ...rest }) => rest as ReportRow);
    this.reportService.reportToMessage(report).subscribe((message) => {
      this.clipboard?.writeText(message)
        .then(() => alert('Successfully copied report to clipboard'))
        .catch(() => alert('Failed to copy report to clipboard'));
    });
  }

  private buildReportForm(report: Report) {
    this.reportFormRows.clear();
    report.forEach(({ id, storage, product, delivery }) => {
      this.reportFormRows.push(
        new FormGroup({
          id: new FormControl(id),
          storage: new FormControl(storage),
          product: new FormControl(product),
          delivery: new FormControl(delivery),
          include: new FormControl(true)
        })
      );
    });
  }
}
