import { Component, OnInit, Input } from '@angular/core';
import { MiddlewareService } from '../../../middleware/middleware.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-files',
  templateUrl: './edit-files.component.html',
  styleUrls: ['./edit-files.component.scss'],
})
export class EditFilesComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;

  @Input()
  vin = '';

  files: FileList | null = null;

  constructor(private service: MiddlewareService, private router: Router) {}

  ngOnInit() {}

  updateFileList(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      this.files = event.currentTarget.files;
    }
  }

  submitFiles(): void {
    if (this.files) {
      this.service
        .addFiles(this.files, this.vin)
        .subscribe(undefined, undefined, () => {
          alert('File upload success!');
          this.reloadComponent();
        });
    }
  }

  reloadComponent(): void {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/claims', this.vin]));
  }

  archiveFile(filename: string): void {
    this.service.archiveFile(filename, this.vin).subscribe(
      undefined,
      error => console.log(error),
      () => {
        alert('FILE ARCHIVED');
        this.reloadComponent();
      },
    );
  }

  restoreFile(filename: string): void {
    this.service.restoreFile(filename, this.vin).subscribe(
      undefined,
      error => console.log(error),
      () => {
        alert('FILE RESTORED');
        this.reloadComponent();
      },
    );
  }

  downloadFile(hash: string, filename: string) {
    this.service.downloadFile(this.vin, hash, filename).subscribe(blob => {
      const url = URL.createObjectURL(new File([blob], filename));
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
