import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './components/callback/callback.component';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { MiddlewareService } from './services/middleware/middleware.service';
import { MaterialModule } from '../modules/material/material.module';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CallbackComponent, NavigationBarComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [NavigationBarComponent, CallbackComponent],
  providers: [AuthGuardService, AuthService, MiddlewareService],
})
export class CoreModule {}
