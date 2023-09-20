import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { Report } from '../services/report.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  readonly reportForm = new FormGroup({
    reportRows: new FormArray<FormGroup<{delivery: FormControl, include: FormControl}>>([])
  });

  get reportFormRows() {
    return this.reportForm.controls['reportRows'];
  }

  report!: Report;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(map((data) => data['report'] as Report))
      .subscribe((report) => {
        this.report = report;
        this.report.forEach(({ delivery }) => {
          this.reportFormRows.push(
            new FormGroup({
              delivery: new FormControl(delivery),
              include: new FormControl(true)
            })
          );
        });
      });
  }

  ngOnDestroy() {}
}
