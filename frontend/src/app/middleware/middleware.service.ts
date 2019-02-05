import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface KeypairResponse {
  public_key: string;
  private_key: string;
}

const API_BASE = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class MiddlewareService {
  constructor(private http: HttpClient) {}

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
}
