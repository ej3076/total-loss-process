import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { MaterialModule } from '../modules/material/material.module';

@NgModule({
  declarations: [
    NewClaimComponent
  ],
  imports: [
    MaterialModule
  ],
  exports: [
    NewClaimComponent
  ]
})
export class SharedModule { }
