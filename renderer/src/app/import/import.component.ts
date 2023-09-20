import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent {
  @ViewChild('fileInput')
  readonly fileInput!: ElementRef<HTMLInputElement>;

  constructor(private readonly router: Router) {}

  @HostListener('dragover', ['$event'])
  onDragEnd(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'move';
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer!.files[0];
    if (!file || file.type !== 'text/html') {
      return;
    }
    this.navigateToEditor(file);
  }

  onEmitFileSelection() {
    this.fileInput.nativeElement.click();
  }

  onSelectFile(e: Event) {
    const file = (e.target as HTMLInputElement).files![0];
    this.navigateToEditor(file);
  }

  private navigateToEditor(file: File) {
    this.router.navigate(['editor'], { state: { file } });
  }
}
