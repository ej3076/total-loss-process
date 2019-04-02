import {
  Component,
  OnInit,
  Input,
  Inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { MiddlewareService } from '../../../core/services/middleware/middleware.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-file-dialog',
  templateUrl: 'edit-file-dialog.html',
})
export class EditFileDialogComponent {
  claim = new EventEmitter<Protos.Claim>();
  data: { file: { name: string; hash: string; status: number }; vin: string };
  success = false;

  fileExtensionPattern: RegExp;
  fileExtension: string | null;
  successfulArchive = false;
  successfulRestore = false;

  newFileName = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<EditFileDialogComponent>,
    private service: MiddlewareService,
    @Inject(MAT_DIALOG_DATA)
    public dataObj: {
      file: { name: string; hash: string; status: number };
      vin: string;
    },
  ) {
    this.data = dataObj;
    this.fileExtensionPattern = /(?:\.([^.]+))?$/;

    const fileName = this.data.file.name;
    this.fileExtension = fileName.substr(fileName.lastIndexOf('.'));
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.successfulArchive = false;
    this.successfulRestore = false;
  }

  archiveFile(): void {
    this.service
      .archiveFile(this.data.file.name, this.data.vin)
      .subscribe(() => {
        this.data.file.status = 1;
        this.successfulArchive = true;
        this.successfulRestore = false;
      });
  }

  restoreFile(): void {
    this.service
      .restoreFile(this.data.file.name, this.data.vin)
      .subscribe(() => {
        this.data.file.status = 0;
        this.successfulRestore = true;
        this.successfulArchive = false;
      });
  }

  renameFile() {
    this.service
      .editFileName(
        this.data.vin,
        this.data.file.name,
        this.newFileName.value + this.fileExtension,
      )
      .subscribe(data => {
        console.log(data);
        const claim = <Protos.Claim>data;
        const file = claim.files.find(
          fileData =>
            fileData.name === this.newFileName.value + this.fileExtension,
        );
        if (file) {
          this.data.file.name = file.name;
          this.newFileName.setValue('');
          this.claim.emit(<Protos.Claim>claim);
        }
      });
  }
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  @Input()
  claim!: Protos.Claim;

  @Input()
  vin = '';

  @Output()
  updatedClaim = new EventEmitter<Protos.Claim>();

  urls = Array<string>();
  success = false;

  files: FileList | null;
  fileList: Array<File>;
  fileType: string;
  pdfFile: File | null;
  isPdf: boolean;

  selected: string;

  constructor(private service: MiddlewareService, public dialog: MatDialog) {
    this.updatedClaim.emit(this.claim);
    this.files = null;
    this.fileList = [];
    this.fileType = 'NONE';
    this.pdfFile = null;
    this.isPdf = false;
    this.selected = 'NONE';
  }

  ngOnInit() {}

  updateFileList(event: Event) {
    if (
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.files
    ) {
      this.urls = [];
      this.fileList = Array.from(event.currentTarget.files);
      this.files = event.currentTarget.files;

      // This gets you a preview of the file you're uploading.
      if (this.files !== null) {
        if (this.files) {
          Array.from(this.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.urls.push(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        }
      }
    }
  }

  submitFiles(selectedFileType: string = 'NONE'): void {
    if (this.files && this.claim) {
      this.service
        .addFiles(this.files, this.claim.vehicle.vin, selectedFileType)
        .subscribe(data => {
          const claim = <Protos.Claim>data;
          this.updatedClaim.emit(claim);
          this.files = null;
          this.success = true;
          this.fileList = [];
          this.urls = [];
        });
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (!event.dataTransfer) {
      return;
    }

    const files: FileList | null = event.dataTransfer!.files;

    if (files) {
      this.urls = [];
      this.fileList = Array.from(files);
      this.files = files;

      // This gets you a preview of the file you're uploading.
      if (this.files !== null) {
        if (files) {
          Array.from(files).forEach(file => {
            this.setIsPdf(file);

            if (this.isPdf) {
              this.pdfFile = files[0];
            }

            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.urls.push(e.target.result);
            };
            reader.readAsDataURL(file);
          });
        }
      }
    }
  }

  onDrag(event: DragEvent): void {
    event.stopPropagation();
    event.preventDefault();
  }

  cancelUpload(): void {
    this.files = null;
    this.fileList = [];
    this.urls = [];
  }

  setIsPdf(file: File): void {
    this.isPdf = file.type === 'application/pdf';
  }
}
