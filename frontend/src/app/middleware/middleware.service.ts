import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

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

    // TODO: Remove mocked data.
    // this.x = {
    //   vehicle: {
    //     vin: vin,
    //     model: "Escape",
    //     color: "Red",
    //     year: 2005,
    //     miles: 100023
    //   },
    //   status: 0,
    //   files: [
    //     {
    //       hash: "1237-1232-1231fsef-123-sgseg",
    //       name: "police-report.png"
    //     }
    //   ]
    // }

    // return of<Protos.Claim> (this.x);

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
        success => {
          // Log when successful / errored navigation
          this.router.navigate([`/claims/${claim.vehicle.vin}`]).then(
            nav => {
              console.log(nav);
            },
            error => {
              console.log(error)
            }
          );
        }
      );
  }

  addFiles(files: FileList, vin: string) {
    let headers = this.headers;
    headers.append('Content-Type', 'multipart/form-data');

    const data = new FormData();

    for (var i = 0; i < files.length; i++) {
      data.append('files[]', files.item(i));
    }

    return this.http.post(`${API_BASE}/claims/${vin}/files`, data, {
      headers: headers
    });
  }
}
