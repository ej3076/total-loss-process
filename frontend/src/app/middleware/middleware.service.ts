import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';

interface KeypairResponse {
  public_key: string;
  private_key: string;
}

const API_BASE = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private claims: Protos.Claim[];

  private x: Protos.Claim;

  constructor(private http: HttpClient, private auth: AuthService) {}

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

  private get fileUploadHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.accessToken}`,
      private_key: this.user['https://total-loss-process.com/private_key'],
      'Content-Type': 'multipart/form-data'
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
      .subscribe();
  }

  addFiles(files: FileList, vin: string) {
    return this.http.post(`${API_BASE}/claims/${vin}/files`, files, {
      headers: this.fileUploadHeaders
    });
  }
}
