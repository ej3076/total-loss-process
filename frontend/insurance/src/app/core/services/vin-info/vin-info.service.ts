import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';
//const API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended';

@Injectable({
  providedIn: 'root',
})
export class VinInfoService {
  constructor(private http: HttpClient) {}

  getVinData(vin: string) {
    console.log(this.http.get(`${API_BASE}/DecodeVinExtended/${vin}`));
    return this.http.get(`${API_BASE}/DecodeVinExtended/${vin}`);
  }
}
