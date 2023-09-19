import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  readonly report$ = this.activatedRoute.data.pipe(
    map((data) => data['report'])
  );

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
