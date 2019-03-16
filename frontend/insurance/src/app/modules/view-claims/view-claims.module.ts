import { NgModule } from '@angular/core';
import { ViewClaimsComponent } from './view-claims.component';
import { AuthService } from '../../core/services/auth/auth.service';
//import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
//import { EditClaimComponent } from '../../shared/components/edit-claim/edit-claim.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ViewClaimsComponent],
  imports: [MaterialModule, CommonModule, SharedModule],
  exports: [ViewClaimsComponent],
  providers: [
    AuthService,
    //MiddlewareService
  ],
})
export class ViewClaimsModule {}
