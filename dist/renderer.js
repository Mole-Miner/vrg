"use strict";
class HTMLFileReader extends FileReader {
    domParser;
    successFn;
    failFn;
    constructor(domParser) {
        super();
        this.domParser = domParser;
        this.addEventListener('load', this.onSuccess);
        this.addEventListener('error', this.onFail);
    }
    readHTMLFile(file, successFn, failFn) {
        if (!file || file.type !== 'text/html') {
            failFn('Expected .htm file');
            return;
        }
        this.successFn = successFn;
        this.failFn = failFn;
        this.readAsText(file);
    }
    onSuccess() {
        try {
            const doc = this.domParser.parseFromString(this.result, 'text/html');
            this.successFn(doc);
        }
        catch (err) {
            this.failFn('Failed to parse .htm');
        }
    }
    onFail() {
        this.failFn('Failed to read .htm');
    }
}
class FileZone {
    htmlFileReader;
    dropZone;
    constructor(htmlFileReader) {
        this.htmlFileReader = htmlFileReader;
        this.dropZone = document.querySelector('.file-zone');
        this.dropZone.addEventListener('dragover', this.onDragOver);
        this.dropZone.addEventListener('drop', (e) => this.onDrop(e));
        const fileInputElement = document.querySelector('.file-zone > input[type=file]');
        fileInputElement.addEventListener('change', (e) => this.onChange(e));
        const buttonElement = document.querySelector('.file-zone > button');
        buttonElement.addEventListener('click', () => fileInputElement.click());
    }
    show() {
        this.dropZone.classList.add('file-zone--show');
    }
    hide() {
        this.dropZone.classList.add('file-zone--hide');
    }
    onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    onDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.hide();
        this.readHTMLFile(file);
    }
    onChange(e) {
        const file = e.target.files[0];
        this.hide();
        this.readHTMLFile(file);
    }
    readHTMLFile(file) {
        this.htmlFileReader.readHTMLFile(file, (doc) => {
            dispatchEvent(new CustomEvent('success-read', { detail: doc }));
        }, (err) => {
            dispatchEvent(new CustomEvent('fail-read', { detail: err }));
        });
    }
}
class ReportEditor {
    editorZone;
    constructor() {
        this.editorZone = document.querySelector('.report-editor');
        addEventListener('success-read', (e) => {
            this.show();
            this.processReport(e.detail);
        });
        addEventListener('fail-read', (e) => {
            console.log(e);
        });
    }
    show() {
        this.editorZone.classList.add('report-editor--show');
    }
    hide() {
        this.editorZone.classList.remove('report-editor--hide');
    }
    processReport(doc) {
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
}
const domParser = new DOMParser;
const htmlFileReader = new HTMLFileReader(domParser);
const fileZone = new FileZone(htmlFileReader);
const reportEditor = new ReportEditor;
