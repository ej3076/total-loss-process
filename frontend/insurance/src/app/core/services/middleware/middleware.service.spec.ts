import { TestBed } from '@angular/core/testing';

import { MiddlewareService } from './middleware.service';
import { AuthService } from '../auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('MidwareService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [AuthService],
    }),
  );

  it('should be created', () => {
    const service: MiddlewareService = TestBed.get(MiddlewareService);
    expect(service).toBeTruthy();
  });
});
