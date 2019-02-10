import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/User';

const API_BASE = 'https://total-loss-process.auth0.com/api/v2/';
const helper = new JwtHelperService();

@Injectable()
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private clientId = 't3sXyFtDUl0wFsHVsQsJbEa4en4bgPly';
  private user: User;

  auth0 = new auth0.WebAuth({
    clientID: this.clientId,
    domain: 'total-loss-process.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid profile',
    audience: 'https://total-loss-process.auth0.com/api/v2/',
  });
  id_token: any;

  constructor(public router: Router, public cookieService: CookieService) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
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
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        // alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
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

  getUser() {
    const decoded = helper.decodeToken(this._idToken);

    this.user = {
      firstName: decoded.given_name || decoded.nickname || decoded.name,
      lastName: decoded.family_name,
      email: decoded.email,
      picture: decoded.picture,
      publicKey: decoded['https://total-loss-process.com/public_key'],
      privateKey: decoded['https://total-loss-process.com/private_key'],
    };

    return this.user;
  }
}
