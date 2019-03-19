import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditClaimComponent } from './edit-claim.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EditClaimComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class EditClaimModule { }
