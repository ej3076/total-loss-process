//Angular imports
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

//Model imports
import { AUTH0_CONFIG } from '../models/Authconfig';
import { User } from '../models/User';

//Auth0 imports
import * as auth0 from 'auth0-js';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable()
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private user: User;

  auth0 = new auth0.WebAuth({
    clientID: AUTH0_CONFIG.clientID,
    domain: AUTH0_CONFIG.domain,
    responseType: AUTH0_CONFIG.responseType,
    redirectUri: AUTH0_CONFIG.callbackURL,
    scope: AUTH0_CONFIG.scope,
    audience: AUTH0_CONFIG.apiUrl,
  });

  appMetadata: {
    color: 'pink';
    type: 'bitch';
  };

  constructor(
    public router: Router,
    public cookieService: CookieService,
    public http: HttpClient,
  ) {
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

  get domain(): string {
    return this.auth0.domain;
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

  Callback = (err: Error | null, data: any) => void {};

  public initializeUser() {
    const auth0Manage = new auth0.Management({
      domain: AUTH0_CONFIG.domain,
      token: this._accessToken,
    });
    auth0Manage.patchUserMetadata(
      this.user.user_id,
      this.appMetadata,
      this.auth0.Callback,
    );
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
    let _name: string;
    let decode = helper.decodeToken(this._idToken);
    console.log(this.auth0);

    console.log(this._idToken);

    if (decode.given_name) {
      _name = decode.given_name;
    } else {
      _name = decode.name;
    }

    this.user = {
      user_id: decode.user_id,
      firstName: _name,
      lastName: decode.family_name,
      email: decode.email,
      picture: decode.picture,
      publicKey: decode['https://total-loss-process.com/public_key'],
      privateKey: decode['https://total-loss-process.com/private_key'],
    };

    return this.user;
  }
}
