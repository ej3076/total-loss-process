import { TestBed } from '@angular/core/testing';

import { MiddlewareService } from './middleware.service';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('MiddlewareService', () => {
  let service: MiddlewareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      providers: [AuthService],
    });

    service = TestBed.get(MiddlewareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClaims', () => {
    it('should return an array of claims', () => {
      const claimsResponse: Array<Protos.Claim> = [
        {
          status: 0,
          created: '',
          modified: '',
          date_of_loss: '',
          vehicle: {
            vin: '1J4GA59178L553429',
            miles: 123,
            location: '',
          },
          insurer: {
            name: '',
            deductible: 1,
            has_gap: false,
          },
          files: [],
        },
      ];

      let response;
      spyOn(service, 'getClaims').and.returnValue(of(claimsResponse));

      service.getClaims().subscribe(res => {
        response = res;
      });

      expect(response).toEqual(claimsResponse);
    });
  });
});
