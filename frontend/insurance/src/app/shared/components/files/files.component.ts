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
    console.log(this.data);
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
      .editFileName(this.data.vin, this.data.file.name, this.newFileName.value)
      .subscribe(data => {
        console.log(data);
        const claim = <Protos.Claim>data;
        const file = claim.files.find(
          fileData => fileData.name === this.newFileName.value,
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

  constructor(private service: MiddlewareService, public dialog: MatDialog) {
    this.updatedClaim.emit(this.claim);
    this.files = null;
    this.fileList = [];
    this.fileType = 'NONE';
  }

  ngOnInit() {}

  updateFileList(event: Event, fileType: string = 'NONE') {
    if (
      event.currentTarget instanceof HTMLInputElement &&
      event.currentTarget.files
    ) {
      this.fileType = fileType;
      this.fileList = Array.from(event.currentTarget.files);
      this.files = event.currentTarget.files;

      // This gets you a preview of the file you're uploading.
      if (this.files !== null) {
        this.urls = [];
        const files = event.currentTarget.files;
        if (files) {
          Array.from(files).forEach(file => {
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

  submitFiles(): void {
    if (this.files && this.claim) {
      this.service
        .addFiles(this.files, this.claim.vehicle.vin, this.fileType)
        .subscribe(data => {
          console.log(data);
          const claim = <Protos.Claim>data;
          this.updatedClaim.emit(claim);
          this.files = null;
          this.success = true;
          this.fileList = [];
        });
    }
  }
}
