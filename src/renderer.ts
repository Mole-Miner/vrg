type HTMLFileReaderSuccessFn = (doc: Document) => void;
type HTMLFileReaderFailFn = (reason: string) => void;

class HTMLFileReader extends FileReader {
  private successFn!: HTMLFileReaderSuccessFn;
  private failFn!: HTMLFileReaderFailFn;

  constructor(private readonly domParser: DOMParser) {
    super();
    this.addEventListener('load', this.onSuccess);
    this.addEventListener('error', this.onFail);
  }

  public readHTMLFile(file: File, successFn: HTMLFileReaderSuccessFn, failFn: HTMLFileReaderFailFn) {
    if (!file || file.type !== 'text/html') {
      failFn('Expected .htm file');
      return;
    }
    this.successFn = successFn;
    this.failFn = failFn;
    this.readAsText(file);
  }

  private onSuccess() {
    try {
      const doc = this.domParser.parseFromString(this.result as string, 'text/html');
      this.successFn(doc);
    } catch (err) {
      this.failFn('Failed to parse .htm');
    }
  }

  private onFail() {
    this.failFn('Failed to read .htm');
  }
}

class FileZone {
  private readonly dropZone!: HTMLDivElement;

  constructor(private readonly htmlFileReader: HTMLFileReader) {
    this.dropZone = document.querySelector('.file-zone')!;
    this.dropZone.addEventListener('dragover', this.onDragOver);
    this.dropZone.addEventListener('drop', (e) => this.onDrop(e));

    const fileInputElement = document.querySelector('.file-zone > input[type=file]')! as HTMLInputElement;
    fileInputElement.addEventListener('change', (e) => this.onChange(e));

    const buttonElement = document.querySelector('.file-zone > button')! as HTMLButtonElement;
    buttonElement.addEventListener('click', () => fileInputElement.click());
  }

  private show() {
    this.dropZone.classList.add('file-zone--show');
  }

  private hide() {
    this.dropZone.classList.add('file-zone--hide');
  }

  private onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  private onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer!.files[0];
    this.hide();
    this.readHTMLFile(file);
  }

  private onChange(e: Event) {
    const file = (e.target as HTMLInputElement).files![0];
    this.hide();
    this.readHTMLFile(file);
  }

  private readHTMLFile(file: File) {
    this.htmlFileReader.readHTMLFile(file, (doc) => {
      dispatchEvent(new CustomEvent('success-read', { detail: doc }));
    }, (err) => {
      dispatchEvent(new CustomEvent('fail-read', { detail: err }));
    })
  }
}

class ReportEditor {
  private readonly editorZone: HTMLDivElement

  constructor() {
    this.editorZone = document.querySelector('.report-editor')! as HTMLDivElement;

    addEventListener('success-read', (e) => {
      this.show();
      this.processReport((e as CustomEvent).detail);
    });

    addEventListener('fail-read', (e) => {
      console.log(e);
    });
  }

  private show() {
    this.editorZone.classList.add('report-editor--show');
  }

  private hide() {
    this.editorZone.classList.remove('report-editor--hide');
  }

  private processReport(doc: Document) {
    const rows = [...doc.querySelectorAll('tr')]
      .slice(10)
      .filter((row) => {
        const cells = row.children;
        const store = cells[1].textContent!;
        const sales = parseInt(cells[4].textContent!.replace(',', ''), 10) || 0;
        const remainder = parseInt(cells[5].textContent!.replace(',', ''), 10) || 0;
        return store.startsWith('ТТ') || isNaN(remainder) || remainder < sales;
      })
      .reduce((acc, row) => {
        const cells = row.children;
        const store = cells[1].textContent;
        const sales = parseInt(cells[4].textContent!.replace(',', ''), 10) || 0;
        const remainder = parseInt(cells[5].textContent!.replace(',', ''), 10) || 0;
        const delivery = sales + remainder;
        return [...acc, `${store} ${delivery}`];
      }, [] as string[]);
  }
}

const domParser = new DOMParser;
const htmlFileReader = new HTMLFileReader(domParser);
const fileZone = new FileZone(htmlFileReader);
const reportEditor = new ReportEditor;
