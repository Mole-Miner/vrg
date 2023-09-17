class HTMLReader extends FileReader {
    _domParser;
    _successFn;
    _failFn;

    constructor(domParser) {
        super();
        this._domParser = domParser;
        this.addEventListener('load', this._onSuccess);
        this.addEventListener('error', this._onFail);
    }

    readHTML(file, successFn, failFn) {
        if (!file || file.type !== 'text/html') {
            failFn('Expected .htm file');
            return;
        }
        this._successFn = successFn;
        this._failFn = failFn;
        this.readAsText(file);
    }

    _onSuccess() {
        try {
            const doc = this._domParser.parseFromString(this.result, 'text/html');
            this._successFn(doc);
        } catch (err) {
            this._failFn('Failed to parse .htm');
        }

    }

    _onFail() {
        this._failFn('Failed to read .htm');
    }
}

class FileZone {
    _fileReader;
    _dropZoneElement;

    constructor(fileReader) {
        this._fileReader = fileReader;

        this._dropZoneElement = document.querySelector('.file-zone');
        this._dropZoneElement.addEventListener('dragover', this._onDragOver);
        this._dropZoneElement.addEventListener('drop', (e) => this._onDrop(e));

        const fileInputElement = document.querySelector('.file-zone > input[type=file]');
        fileInputElement.addEventListener('change', (e) => this._onChange(e));

        const buttonElement = document.querySelector('.file-zone > button');
        buttonElement.addEventListener('click', () => fileInputElement.click());
    }

    _show() {
        this._dropZoneElement.classList.add('file-zone--show');
    }

    _hide() {
        this._dropZoneElement.classList.add('file-zone--hide');
    }

    _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    _onDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this._hide();
        this._readHTML(file);
    }

    _onChange(e) {
        const file = e.target.files[0];
        this._hide();
        this._readHTML(file);
    }

    _readHTML(file) {
        this._fileReader.readHTML(file, (doc) => {
            dispatchEvent(new CustomEvent('success-read', {detail: doc}))
        }, (err) => {
            dispatchEvent(new CustomEvent('fail-read', {detail: err}));
        });
    }
}

class ReportEditor {
    _reportElement;

    constructor() {
        this._reportElement = document.querySelector('.report-editor');

        addEventListener('success-read', (e) => {
            this._show();
            this._processReport(e.detail);
        });

        addEventListener('fail-read', (e) => {
            console.log(e);
        });
    }

    _processReport(doc) {
        const rows = [...doc.querySelectorAll('tr')]
            .slice(10)
            .filter((row) => {
                const cells = row.children;
                const store = cells[1].textContent;
                const sales = parseInt(cells[4].textContent.replace(',', ''), 10) || 0;
                const remainder = parseInt(cells[5].textContent.replace(',', ''), 10) || 0;
                return store.startsWith('ТТ') || isNaN(remainder) || remainder < sales;
            })
            .reduce((acc, row) => {
                const cells = row.children;
                const store = cells[1].textContent;
                const sales = parseInt(cells[4].textContent.replace(',', ''), 10) || 0;
                const remainder = parseInt(cells[5].textContent.replace(',', ''), 10) || 0;
                const delivery = sales + remainder;
                return [...acc, `${store} ${delivery}`];
            }, []);
    }

    _show() {
        this._reportElement.classList.add('report-editor--show');
    }

    _hide() {
        this._reportElement.classList.remove('report-editor--hide');
    }
}

const parser = new DOMParser;
const reader = new HTMLReader(parser);
const fileZone = new FileZone(reader);
const reportEditor = new ReportEditor;
