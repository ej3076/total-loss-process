import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn) {
      if (window.localStorage.getItem('auth')) {
        return true;
      }

      localStorage.setItem('url', route.url.join('/'));
      console.log(route.url.join('/'));

      this.authService.login();
      return false;
    }
    return true;
  }
}
