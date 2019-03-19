import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './core/components/callback/callback.component';
import { HomeComponent } from './modules/home/home.component';
import { ViewClaimsComponent } from './modules/view-claims/view-claims.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
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
