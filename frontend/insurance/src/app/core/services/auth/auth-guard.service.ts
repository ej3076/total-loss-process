import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn) {
      if (window.localStorage.getItem('auth')) {
        return true;
      }
      return false;
    }
    return true;
  }
}
