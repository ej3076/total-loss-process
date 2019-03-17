import { NgModule } from '@angular/core';
import { ViewClaimsComponent } from './view-claims.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ViewClaimsComponent],
  imports: [MaterialModule, CommonModule, SharedModule],
  exports: [ViewClaimsComponent],
  providers: [
    AuthService,
  ],
})
export class ViewClaimsModule {}
