import { NgModule } from '@angular/core';
import { ViewClaimsComponent } from './view-claims.component';
import { AuthService } from '../../core/services/auth/auth.service';
import { MiddlewareService } from '../../core/services/middleware/middleware.service';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ViewClaimsComponent
  ],
  imports: [
    MaterialModule,
    CommonModule
  ],
  exports: [
    ViewClaimsComponent
  ],
  providers: [
    AuthService,
    MiddlewareService
  ]
})
export class ViewClaimsModule { }
