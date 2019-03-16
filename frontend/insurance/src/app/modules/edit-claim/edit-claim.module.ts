import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditClaimComponent } from './edit-claim.component';
import { EditClaimRoutingModule } from './edit-claim-routing.module';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditFilesComponent } from './edit-files/edit-files.component';

@NgModule({
  declarations: [EditClaimComponent, EditVehicleComponent, EditFilesComponent],
  imports: [
    CommonModule,
    EditClaimRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EditClaimModule {}
