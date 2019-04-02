import { NgModule } from '@angular/core';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { MaterialModule } from '../modules/material/material.module';
import { EditClaimSharedComponent } from './components/edit-claim/edit-claim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FilesComponent,
  EditFileDialogComponent,
} from './components/files/files.component';
import { MatDialogModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    NewClaimComponent,
    EditClaimSharedComponent,
    FilesComponent,
    EditFileDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    RouterModule,
    PdfViewerModule,
  ],
  exports: [
    NewClaimComponent,
    EditClaimSharedComponent,
    FilesComponent,
    EditFileDialogComponent,
  ],
  entryComponents: [EditFileDialogComponent],
})
export class SharedModule {}
