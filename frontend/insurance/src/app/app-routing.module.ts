import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './core/components/callback/callback.component';
import { ViewClaimsComponent } from './modules/view-claims/view-claims.component';
import { EditClaimComponent } from './modules/edit-claim/edit-claim.component';
import { NewClaimComponent } from './shared/components/new-claim/new-claim.component';
import { AuthGuardService } from './core/services/auth/auth-guard.service';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ViewClaimsComponent },
  {
    path: 'claims/new',
    component: NewClaimComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'claims/:vin',
    component: EditClaimComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'callback', component: CallbackComponent },
  {
    path: '**', pathMatch: 'full', component: ViewClaimsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
