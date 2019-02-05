import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { ViewClaimsComponent } from './view-claims/view-claims.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'new-claim', component: NewClaimComponent},
  {path: 'view-claims', component: ViewClaimsComponent},
  {path: 'callback', component: CallbackComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
