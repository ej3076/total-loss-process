import { NgModule } from '@angular/core';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { MaterialModule } from '../modules/material/material.module';
import { EditClaimComponent } from './components/edit-claim/edit-claim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FilesComponent,
  FileDialogComponent,
  EditFileDialogComponent,
} from './components/files/files.component';
import { MatDialogModule } from '@angular/material';

@NgModule({
  declarations: [
    NewClaimComponent,
    EditClaimComponent,
    FilesComponent,
    FileDialogComponent,
    EditFileDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
  ],
  exports: [
    NewClaimComponent,
    EditClaimComponent,
    FilesComponent,
    FileDialogComponent,
    EditFileDialogComponent,
  ],
  entryComponents: [FileDialogComponent, EditFileDialogComponent],
})
export class SharedModule {}
