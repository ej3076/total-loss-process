import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Vehicle } from '../models/Vehicle';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/User';
import { Observable } from 'rxjs';

interface KeypairResponse {
  public_key: string;
  private_key: string;
}

const API_BASE = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  private claims: Vehicle[];
  private user: User;

  constructor(private http: HttpClient, private auth: AuthService) {
    if (auth.isAuthenticated()) {
      this.user = auth.getUser();
    }
  }

  generateKeypair() {
    return this.http.post<KeypairResponse>(`${API_BASE}/keys/generate`, null);
  }

  checkGet() {
    return this.http.get(API_BASE, { responseType: 'text' });
  }

  checkPost() {
    return this.http.post(API_BASE, 'any');
  }

  checkPut() {
    return this.http.put(API_BASE, 'any');
  }

  checkDelete() {
    return this.http.delete(API_BASE);
  }

  getClaims(): Observable<Vehicle[]> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', this.auth.idToken);
    headers = headers.append('private_key', this.user.privateKey);

    return this.http.get<Vehicle[]>(`${API_BASE}/vehicles`, { headers });
  }

  addClaim(vehicle: Vehicle) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', `Bearer ${this.auth.idToken}`);
    headers = headers.append('private_key', this.user.privateKey);
    return this.http.post(`${API_BASE}/vehicles/${vehicle.vin}`, vehicle, {
      headers,
    });
  }
}
