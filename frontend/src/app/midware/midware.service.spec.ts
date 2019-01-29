import { TestBed } from '@angular/core/testing';

import { MidwareService } from './midware.service';

describe('MidwareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MidwareService = TestBed.get(MidwareService);
    expect(service).toBeTruthy();
  });
});
