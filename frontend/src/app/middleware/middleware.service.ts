import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

interface KeypairResponse {
  public_key: string;
  private_key: string;
}

const { API_BASE } = environment;

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private claims: Protos.Claim[];

  private x: Protos.Claim;

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  get user() {
    if (this.auth.loggedIn) {
      return this.auth.userProfile;
    }

    throw new Error('User needs to be logged in');
  }

  private get headers() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.accessToken}`,
      private_key: this.user['https://total-loss-process.com/private_key'],
    });
  }

  generateKeypair() {
    return this.http
      .post<KeypairResponse>(`${API_BASE}/keys/generate`, null)
      .subscribe();
  }

  getClaims() {
    return this.http.get<Protos.Claim[]>(`${API_BASE}/claims`, {
      headers: this.headers,
    });
  }

  getClaim(vin: string): Observable<Protos.Claim> {
    return this.http.get<Protos.Claim>(`${API_BASE}/claims/${vin}`, {
      headers: this.headers
    });
  }

  addClaim(claim: DeepPartial<Protos.Claim>) {
    return this.http
      .post(`${API_BASE}/claims`, claim, {
        headers: this.headers,
      })
      .subscribe( 
        data => {},
        undefined,
        () => this.router.navigate([`/claims/${claim.vehicle.vin}`])
      );
  };

  editClaim(claim: DeepPartial<Protos.Claim>) {
    console.log(claim);
    return this.http
      .post(`${API_BASE}/claims/${claim.vehicle.vin}`, claim, {
        headers: this.headers
      })
      .subscribe(
        data => {},
        error => {alert("Edit failed, please check console log")},
        () => {
          alert("Edit successful!");
          this.router.navigateByUrl('/home', {skipLocationChange: true}).then(()=>
            this.router.navigate([`/claims/${claim.vehicle.vin}`]));
        }
      );
  };

  addFiles(files: FileList, vin: string) {
    let headers = this.headers;
    headers.append('Content-Type', 'multipart/form-data');

    const data = new FormData();

    for (var i = 0; i < files.length; i++) {
      data.append('files[]', files.item(i));
    }

    return this.http.post(`${API_BASE}/claims/${vin}/files`, data, {
      headers: headers
    })
    .subscribe(
      data => {},
      undefined,
      () => {
        alert("File upload success!");

      }
    );
  }

  deleteFile(hash: string, vin: string) {
    return this.http.delete(`${API_BASE}/claims/${vin}/files/${hash}`, {
      headers: this.headers
    });
  }
}
