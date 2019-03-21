import { TestBed } from '@angular/core/testing';

import { VinInfoService } from './vin-info.service';

describe('VinInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VinInfoService = TestBed.get(VinInfoService);
    expect(service).toBeTruthy();
  });
});
