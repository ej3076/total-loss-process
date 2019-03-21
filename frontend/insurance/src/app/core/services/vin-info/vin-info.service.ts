import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VinApi } from '../../../shared/interfaces/VinApi';

const API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

@Injectable({
  providedIn: 'root',
})
export class VinInfoService {
  constructor(private http: HttpClient) {}

  getVinData(vin: string) {
    return this.http.get<VinApi>(
      `${API_BASE}/DecodeVinValues/${vin}?format=json`,
    );
  }
}
