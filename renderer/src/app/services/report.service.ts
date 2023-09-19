import { Injectable } from '@angular/core';
import { concatAll, from, of, toArray } from "rxjs";

@Injectable()
export class ReportService {
  processReport(doc: Document) {
    return of([...doc.querySelectorAll('tr')]).pipe(
      concatAll(),
      toArray()
    )
  }
}
