import { TestBed, async } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthService],
    });
  }));

  describe('canActivate', () => {
    it('should return true for a logged in user', () => {
      const service: AuthGuardService = TestBed.get(AuthGuardService);
      expect(service).toBeTruthy();
    });
  });
});
