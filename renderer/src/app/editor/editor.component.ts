import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ReportItems } from "../services/report.service";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  readonly form = new FormGroup({report: new FormArray<FormArray>([])});

  get formReport() {
    return this.form.get('report') as FormArray<FormArray>
  }

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map((data) => data['report'] as ReadonlyArray<ReportItems>),
      )
      .subscribe((report) => {
        console.log(report);
        for (const reportItems of report) {
          const formArray = new FormArray<FormControl>([]);
          for (const reportItem of reportItems.slice(1)) {
            formArray.push(new FormControl(reportItem['delivery']));
          }
          this.formReport.push(formArray);
        }
      });
  }

  ngOnDestroy() {}
}
