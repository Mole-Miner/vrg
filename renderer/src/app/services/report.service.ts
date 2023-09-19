import { Injectable } from '@angular/core';
import {
  filter,
  from,
  groupBy,
  map,
  mergeMap,
  scan,
  skip,
  toArray
} from 'rxjs';

type ReportItem = Partial<{ factory: string; product: string; delivery: string }>;
export type ReportItems = ReadonlyArray<ReportItem>;

@Injectable()
export class ReportService {
  processReport(doc: Document) {
    return from([...doc.querySelectorAll('tr')]).pipe(
      skip(10),
      map(({ cells }) => {
        const name = cells[1].textContent!;
        const sales = this.extractNumberFromCell(cells[4]);
        const remainder = this.extractNumberFromCell(cells[5]);
        return { name, sales, remainder };
      }),
      filter(
        ({ name, sales, remainder }) =>
          name.startsWith('ТТ') || remainder < sales
      ),
      scan(
        (acc, { name, sales, remainder }) => {
          if (name.startsWith('ТТ')) {
            return {
              factory: name
            };
          }
          const delivery = sales - remainder;
          const formatDelivery =
            delivery < 1000
              ? String(delivery / 1000).replace('.', ',')
              : new Intl.NumberFormat('en-EN').format(delivery);
          return {
            factory: acc.factory,
            product: name,
            delivery: formatDelivery
          };
        },
        {} as ReportItem
      ),
      groupBy((item) => item['factory']),
      mergeMap((group) => group.pipe(toArray())),
      toArray()
    );
  }

  private extractNumberFromCell(cell: HTMLTableCellElement) {
    return parseInt(cell.textContent!.replace(',', ''), 10) || 0;
  }
}
