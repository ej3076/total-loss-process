import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './core/components/callback/callback.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ViewClaimsComponent } from './view-claims/view-claims.component';
import { AuthGuardService } from './core/services/auth/auth-guard.service';
import { EditClaimComponent } from './modules/edit-claim/edit-claim.component';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'claims/new',
    component: NewClaimComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'claims/:vin',
    component: EditClaimComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'claims',
    component: ViewClaimsComponent,
  },
  { path: 'callback', component: CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
