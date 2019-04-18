import { TestBed } from '@angular/core/testing';

import { MiddlewareService } from './middleware.service';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

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
  {
    status: 1,
    created: '',
    modified: '',
    date_of_loss: '',
    vehicle: {
      vin: '1NXBR32E47Z851483',
      miles: 321,
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

describe('MiddlewareService', () => {
  var service: MiddlewareService;

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
      let response;
      spyOn(service, 'getClaims').and.returnValue(of(claimsResponse));

      service.getClaims().subscribe(res => {
        response = res;
      });

      expect(response).toEqual(claimsResponse);
    });
  });

  describe('getClaim', () => {
    it('should return a single claim', () => {
      let response;
      spyOn(service, 'getClaim').and.returnValue(of(claimsResponse[1]));

      service.getClaim('1NXBR32E47Z851483').subscribe(res => {
        response = res;
      });

      expect(response).toEqual(claimsResponse[1]);
    });
  });

  describe('addClaim', () => {
    it('should add a single claim and return it in response', () => {
      let response;
      spyOn(service, 'addClaim').and.returnValue(of(claimsResponse[0]));

      service.addClaim(claimsResponse[0]).subscribe(res => {
        response = res;
      });

      expect(response).toEqual(claimsResponse[0]);
    });
  });
});
