import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Auth0DecodedHash as DecodedHash,
  Auth0UserProfile as User,
  Management,
  WebAuth,
} from 'auth0-js';

import { environment as env } from '../../../../environments/environment';

interface KeypairResponse {
  public_key: string;
  private_key: string;
}

@Injectable()
export class AuthService {
  static readonly AUTH0_OPTIONS = {
    clientID: 't3sXyFtDUl0wFsHVsQsJbEa4en4bgPly',
    domain: 'total-loss-process.auth0.com',
    responseType: 'token id_token',
    redirectUri: `${window.location.origin}/callback`,
    audience: 'https://total-loss-process.auth0.com/api/v2/',
    scope: [
      'openid',
      'profile',
      'create:current_user_metadata',
      'read:current_user',
      'update:current_user_metadata',
    ].join(' '),
  };

  // TODO: use this for snackbar alerts
  errorMessage = '';

  private _accessToken = '';
  private _isLoggedIn = false;
  private _user: User | undefined;
  private auth0: WebAuth;

  constructor(private router: Router) {
    this.auth0 = new WebAuth(AuthService.AUTH0_OPTIONS);
    if (window.localStorage.getItem('auth')) {
      this.login();
    }
  }

  get accessToken() {
    if (!this._accessToken) {
      throw new Error('User is not logged in.');
    }
    return this._accessToken;
  }

  get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      private_key: this.user.user_metadata.private_key,
    });
  }

  get isLoggedIn() {
    return this._isLoggedIn;
  }

  get user(): User {
    if (!this._user) {
      throw new Error('User is not logged in.');
    }
    return this._user;
  }

  async authenticateCallback() {
    this.auth0.parseHash((err, data) => {
      if (err || !data) {
        this.errorMessage = err
          ? err.errorDescription
          : 'Error fetching data from login provider.';
        console.error(this.errorMessage);
      } else {
        const expiresIn = data.expiresIn || 0;
        window.localStorage.setItem(
          'auth',
          JSON.stringify({
            accessToken: data.accessToken,
            expires: expiresIn * 1000 + Date.now(),
          }),
        );
        this.setUser(data);
      }
      this.router.navigate(['/']);
    });
  }

  login() {
    const auth = JSON.parse(window.localStorage.getItem('auth') || '{}');
    if (Object.keys(auth).length > 0) {
      if (auth.expires <= Date.now()) {
        window.localStorage.removeItem('auth');
      } else {
        this.setUser({ accessToken: auth.accessToken });
        return;
      }
    }
    this.auth0.checkSession({}, (err, user) => {
      if (err) {
        return this.auth0.authorize();
      }
      this.setUser(user);
    });
  }

  logout() {
    this._isLoggedIn = false;
    this._accessToken = '';
    this._user = undefined;
    window.localStorage.removeItem('auth');
    this.auth0.logout({ returnTo: window.location.origin });
  }

  private async generateKeypair(): Promise<KeypairResponse> {
    return fetch(`${env.API_BASE}/keys/generate`, {
      method: 'POST',
    }).then(res => res.json());
  }

  private async setUser({ accessToken }: DecodedHash) {
    if (!accessToken) {
      throw new Error('Error retrieving accessToken');
    }
    return new Promise<User>((resolve, reject) => {
      this.auth0.client.userInfo(accessToken, async (err, userInfo) => {
        if (err) {
          return reject(new Error(err.errorDescription));
        }
        resolve(userInfo);
      });
    })
      .then(({ sub }) => {
        return new Promise<User>((resolve, reject) => {
          new Management({
            domain: AuthService.AUTH0_OPTIONS.domain,
            token: accessToken,
          }).getUser(sub, async (err, user) => {
            if (err) {
              return reject(new Error(err.errorDescription));
            }
            if (!user.user_metadata || !user.user_metadata.private_key) {
              return resolve(this.setUserKeys(accessToken, sub));
            }
            resolve(user);
          });
        });
      })
      .then(user => {
        this._user = user;
        this._accessToken = accessToken;
        this._isLoggedIn = true;
      })
      .catch(e => {
        this.errorMessage = e.message;
        console.error(this.errorMessage);
      });
  }

  private async setUserKeys(accessToken: string, id: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.generateKeypair().then(keypair => {
        new Management({
          domain: AuthService.AUTH0_OPTIONS.domain,
          token: accessToken,
        }).patchUserMetadata(id, keypair, (err, user) => {
          if (err) {
            return reject(err);
          }
          resolve(user);
        });
      });
    });
  }
}
