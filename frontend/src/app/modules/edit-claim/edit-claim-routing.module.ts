import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditClaimComponent } from './edit-claim.component';
import { AuthGuardService } from '../../auth/auth-guard.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditClaimRoutingModule {}
