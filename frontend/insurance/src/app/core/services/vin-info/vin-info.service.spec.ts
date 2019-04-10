import { TestBed } from '@angular/core/testing';

import { VinInfoService } from './vin-info.service';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { inject } from '@angular/core';

describe('VinInfoService', () => {
  let httpMock: HttpTestingController;
  let testService: VinInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });

    httpMock = TestBed.get(HttpTestingController);
    testService = TestBed.get(VinInfoService);
  });

  it('should be created', () => {
    const service: VinInfoService = TestBed.get(VinInfoService);
    expect(service).toBeTruthy();
  });

  it('should expect a successful HTTP call to Vehicle API', () => {
    testService.getVinData('1234').subscribe(response => {
      expect(response).toBeDefined();
    });

    const req = httpMock.expectOne(
      'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/1234?format=json',
    );
    expect(req.request.method).toEqual('GET');
    httpMock.verify();
  });

  it('should invalidate the vin', () => {
    const service: VinInfoService = TestBed.get(VinInfoService);

    expect(service.getVinData('blahblah')).toBeDefined();
  });
});
