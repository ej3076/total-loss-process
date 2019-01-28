// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 't3sXyFtDUl0wFsHVsQsJbEa4en4bgPly',
    domain: 'total-loss-process.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid'
  });

  constructor(public router: Router, public cookieService: CookieService) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;

    this.setFromCookie();
  }

  private setFromCookie(): void {

    if (
      this.cookieService.check('access_token') &&
      this.cookieService.check('id_token') &&
      this.cookieService.check('expires_at')
      ) {
        this._idToken = this.cookieService.get('id_token');
        this._accessToken = this.cookieService.get('access_token');
        this._expiresAt = +this.cookieService.get('expires_at');
      }
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.localLogin(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private localLogin(authResult): void {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        //alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;

    this.cookieService.delete('access_token');
    this.cookieService.delete('id_token');
    this.cookieService.delete('expires_at');

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    
    return new Date().getTime() < this._expiresAt;
  }

  public saveUserSession(): void {
    var now = new Date('tomorrow');

    this.cookieService.set('access_token', this._accessToken, now);
    this.cookieService.set('id_token', this._idToken, now);
    this.cookieService.set('expires_at', this._expiresAt.toString(), now);
  }
}