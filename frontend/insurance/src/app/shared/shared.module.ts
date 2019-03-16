import { NgModule } from '@angular/core';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { MaterialModule } from '../modules/material/material.module';
import { EditClaimComponent } from './components/edit-claim/edit-claim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NewClaimComponent,
    EditClaimComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    NewClaimComponent
  ]
})
export class SharedModule {}
