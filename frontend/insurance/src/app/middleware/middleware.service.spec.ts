import { TestBed } from '@angular/core/testing';

import { MiddlewareService } from './middleware.service';

describe('MidwareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiddlewareService = TestBed.get(MiddlewareService);
    expect(service).toBeTruthy();
  });
});
