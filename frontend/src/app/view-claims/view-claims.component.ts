import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
import { Vehicle } from '../models/Vehicle';
import { MiddlewareService } from '../middleware/middleware.service';
import { AuthService } from '../auth/auth.service';

const STYLES = {
  paper: {
    display: 'block',
    margin: '.5em',
    padding: '1em',
  },
};

@Component({
  selector: 'app-view-claims',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
})
export class ViewClaimsComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);

  private claims: Vehicle[];

  constructor(
    private _theme: LyTheme2,
    private middlewareService: MiddlewareService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.middlewareService.getClaims().subscribe(data => {
        this.claims = data;
      });
    } else {
      var vehicle1: Vehicle = {
        vin: '1234567',
        model: 'TEST MODEL',
        color: 'TEST COLOR',
        status: 0,
      };

      var vehicle2: Vehicle = {
        vin: '123456789',
        model: 'TEST MODEL',
        color: 'TEST COLOR',
        status: 0,
      };

      var vehicle3: Vehicle = {
        vin: '12345678901',
        model: 'TEST MODEL',
        color: 'TEST COLOR',
        status: 0,
      };

      var arrayOfVehicles = [vehicle1, vehicle2, vehicle3];

      this.claims = arrayOfVehicles;
    }
  }
}
