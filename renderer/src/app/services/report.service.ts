import { Injectable } from '@angular/core';
import {
  filter,
  from,
  groupBy,
  map,
  mergeMap, Observable,
  scan,
  skip,
  toArray
} from 'rxjs';

type DocumentRow = Readonly<{
  storage: string;
  product: string;
  sales: number;
  remainder: number;
}>;

type ReportRow = Readonly<{
  storage: string;
  product: string;
  delivery: string;
}>;

type ReportRows = ReadonlyArray<ReportRow>;

export type Report = ReadonlyArray<ReportRows>;

@Injectable()
export class ReportService {
  processReport(doc: Document): Observable<Report> {
    return from([...doc.querySelectorAll('tr')]).pipe(
      skip(10),
      scan((acc, { cells }) => {
        const name = cells[1].textContent!;
        if (name.startsWith('ТТ')) {
          return { storage: name };
        }
        const sales = this.extractNumberFromCell(cells[4]);
        const remainder = this.extractNumberFromCell(cells[5]);
        return {
          storage: acc.storage as string,
          product: name,
          sales,
          remainder
        };
      }, {} as any),
      filter(
        ({ product, sales, remainder }: DocumentRow) =>
          product !== '' && remainder <= sales
      ),
      map(({ storage, product, sales, remainder }): ReportRow => {
        const delivery = sales - remainder;
        const formattedDelivery =
          delivery < 1000
            ? String(delivery / 1000).replace('.', ',')
            : new Intl.NumberFormat('en-EN').format(delivery);
        return {
          storage,
          product,
          delivery: formattedDelivery
        };
      }),
      groupBy((reportRow) => reportRow.storage),
      mergeMap((group) => group.pipe(toArray())),
      toArray()
    );
  }

  private extractNumberFromCell(cell: HTMLTableCellElement) {
    return parseInt(cell.textContent!.replace(',', ''), 10) || 0;
  }
}
