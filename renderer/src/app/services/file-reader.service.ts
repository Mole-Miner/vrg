import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class FileReaderService {
  readFile(file: File) {
    return new Observable<Document>((subscriber) => {
      const domParser = new DOMParser();
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const doc = domParser.parseFromString(
            fr.result as string,
            'text/html'
          );
          subscriber.next(doc);
          subscriber.complete();
        } catch (err) {
          subscriber.error('Failed to parse .html file');
        }
      };
      fr.onerror = () => {
        subscriber.error('Failed to read .html file');
      };
      fr.readAsText(file);
    });
  }
}
