import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';

import { VinApi } from '../../../shared/interfaces/VinApi';

const API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

@Injectable({
  providedIn: 'root',
})
export class VinInfoService {
  constructor(private http: HttpClient) {}

  getVinData(vin: string) {
    const normalizedVin = vin.toUpperCase();
    const existingVins = JSON.parse(
      window.localStorage.getItem('vin-data') || '{}',
    );
    if (existingVins[normalizedVin]) {
      return from(Promise.resolve(existingVins[normalizedVin]));
    }
    return this.http
      .get<VinApi>(`${API_BASE}/DecodeVinValues/${normalizedVin}?format=json`)
      .pipe(
        tap(data => {
          window.localStorage.setItem(
            'vin-data',
            JSON.stringify({ ...existingVins, [normalizedVin]: data }),
          );
        }),
      );
  }
}
