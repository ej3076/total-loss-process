import { Component, OnInit, Input, Inject } from '@angular/core';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  @Input()
  claim: Protos.Claim | undefined;

  @Input()
  vin = '';

  files: FileList | null = null;

  constructor(private service: MiddlewareService, public dialog: MatDialog) {}

  ngOnInit() {}

  archiveFile(filename: string): void {
    this.service.archiveFile(filename, this.vin).subscribe(
      undefined,
      error => console.log(error),
      () => {
        alert('FILE ARCHIVED');
      },
    );
  }

  restoreFile(filename: string): void {
    this.service.restoreFile(filename, this.vin).subscribe(
      undefined,
      error => console.log(error),
      () => {
        alert('FILE RESTORED');
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

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialog, {
      width: '500px',
      data: this.claim,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class FileDialog {
  urls = Array<string>();
  success = false;

  constructor(
    public dialogRef: MatDialogRef<FileDialog>,
    private service: MiddlewareService,
    @Inject(MAT_DIALOG_DATA) public data: Protos.Claim,
    @Inject(MAT_DIALOG_DATA) public files: FileList | null,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.files = null;
  }

  updateFileList(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      this.files = event.currentTarget.files;

      // This gets you a preview of the file you're uploading.
      if (this.files !== null) {
        this.urls = [];
        let files = event.currentTarget.files;
        if (files) {
          Array.from(files).forEach(file => {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.urls.push(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        }
      }
    }
  }

  submitFiles(): void {
    if (this.files) {
      this.service
        .addFiles(this.files, this.data.vehicle.vin)
        .subscribe(data => {
          console.log(data);
          this.files = null;
          this.success = true;
        });
    }
  }
}

@Component({
  selector: 'edit-file-dialog',
  templateUrl: 'edit-file-dialog.html',
})
export class EditFileDialog {
  file: Protos.File | null = null;
  success = false;

  constructor(
    public dialogRef: MatDialogRef<FileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Protos.File,
  ) {
    this.file = data;
    console.log(this.file);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
