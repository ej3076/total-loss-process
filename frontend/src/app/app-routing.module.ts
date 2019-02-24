import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ViewClaimsComponent } from './view-claims/view-claims.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { EditClaimComponent } from './edit-claim/edit-claim.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'claims/new',
    component: NewClaimComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'claims',
    component: ViewClaimsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'claims/:vin',
    component: EditClaimComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'callback', component: CallbackComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
