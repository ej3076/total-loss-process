import { NgModule } from '@angular/core';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { MaterialModule } from '../modules/material/material.module';
import { EditClaimComponent } from './components/edit-claim/edit-claim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  FilesComponent,
  FileDialog,
  EditFileDialog,
} from './components/files/files.component';

@NgModule({
  declarations: [
    NewClaimComponent,
    EditClaimComponent,
    FilesComponent,
    FileDialog,
    EditFileDialog,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [
    NewClaimComponent,
    EditClaimComponent,
    FilesComponent,
    FileDialog,
    EditFileDialog,
  ],
  entryComponents: [FileDialog, EditFileDialog],
})
export class SharedModule {}
