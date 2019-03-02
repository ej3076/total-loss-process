import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

const { API_BASE } = environment;

type MinimalClaim = DeepPartial<Protos.Claim> & { vehicle: { vin: string } };

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
  ) {}

  getClaims() {
    return this.http.get<Protos.Claim[]>(`${API_BASE}/claims`, {
      headers: this.auth.headers,
    });
  }

  getClaim(vin: string): Observable<Protos.Claim> {
    return this.http.get<Protos.Claim>(`${API_BASE}/claims/${vin}`, {
      headers: this.auth.headers,
    });
  }

  addClaim(claim: MinimalClaim) {
    return this.http
      .post(`${API_BASE}/claims`, claim, {
        headers: this.auth.headers,
      })
      .subscribe(undefined, undefined, () =>
        this.router.navigate([`/claims/${claim.vehicle.vin}`]),
      );
  }

  editClaim(claim: MinimalClaim) {
    console.log(claim);
    return this.http
      .post(`${API_BASE}/claims/${claim.vehicle.vin}`, claim, {
        headers: this.auth.headers,
      })
      .subscribe(
        undefined,
        error => {
          alert('Edit claim failed');
          console.error(error);
        },
        () => {
          alert('Edit successful!');
          this.router.navigateByUrl('/claims');
        },
      );
  }

  addFiles(files: FileList, vin: string) {
    const data = new FormData();

    for (const file of [...files]) {
      data.append('files[]', file);
    }

    return this.http
      .post(`${API_BASE}/claims/${vin}/files`, data, {
        headers: this.auth.headers,
      });
  }

  deleteFile(filename: string, vin: string) {
    return this.http.post(`${API_BASE}/claims/${vin}/files/${filename}/archive`, null, {
      headers: this.auth.headers,
    });
  }

  restoreFile(filename: string, vin: string) {
    return this.http.post(`${API_BASE}/claims/${vin}/files/${filename}/restore`, null, {
      headers: this.auth.headers,
    });
  }

  downloadFile(vin: string, hash: string, filename: string) {
    return this.http.get<Blob>(`${API_BASE}/claims/${vin}/files/${filename}`, {
      headers: this.auth.headers,
      params: { hash }
    }).subscribe(
      data => {
        console.log(data);
      }
    );
  }
}
