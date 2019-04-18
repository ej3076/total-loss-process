import { TestBed } from '@angular/core/testing';

import { VinInfoService } from './vin-info.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VinInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });
  });

  it('should be created', () => {
    const service: VinInfoService = TestBed.get(VinInfoService);
    expect(service).toBeTruthy();
  });
});
