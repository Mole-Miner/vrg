import { Injectable } from '@angular/core';
import { filter, from, map, Observable, scan, skip, toArray } from 'rxjs';

type DocumentRow = Readonly<{
  storage: string;
  product: string;
  sales: number;
  remainder: number;
}>;

export type ReportRow = Readonly<{
  id: number;
  storage: string;
  product: string;
  delivery: string;
}>;

export type Report = ReadonlyArray<ReportRow>;

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
          product !== '' && remainder < sales
      ),
      map(({ storage, product, sales, remainder }, index): ReportRow => {
        const delivery = sales - remainder;
        const formattedDelivery =
          delivery < 1000
            ? String(delivery / 1000).replace('.', ',')
            : new Intl.NumberFormat('en-EN').format(delivery);
        return {
          id: index,
          storage,
          product,
          delivery: formattedDelivery
        };
      }),
      toArray()
    );
  }

  private extractNumberFromCell(cell: HTMLTableCellElement) {
    return parseInt(cell.textContent!.replace(',', ''), 10) || 0;
  }
}
