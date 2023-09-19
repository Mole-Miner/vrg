import { Injectable } from '@angular/core';
import { concatAll, filter, from, map, of, skip, toArray } from 'rxjs';

@Injectable()
export class ReportService {
  processReport(doc: Document) {
    return of([...doc.querySelectorAll('tr')]).pipe(
      concatAll(),
      skip(10),
      map(({ cells }) => {
        const store = cells[1].textContent!;
        const sales = parseInt(cells[4].textContent!.replace(',', ''), 10) || 0;
        const remainder =
          parseInt(cells[5].textContent!.replace(',', ''), 10) || 0;
        return { store, sales, remainder };
      }),
      filter(
        ({ store, sales, remainder }) =>
          store.startsWith('ТТ') || remainder < sales
      ),
      map(({ store, sales, remainder }) => ({
        store,
        delivery: sales - remainder
      })),
      toArray()
    );
  }
}
