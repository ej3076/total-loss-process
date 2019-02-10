import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';
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

  private claims: Protos.Claim[];

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
      // FIXME: Pitch this
      this.claims = [
        {
          files: [],
          status: 0,
          vehicle: {
            vin: '112233445566',
            model: 'TEST MODEL 1',
            color: 'TEST COLOR 1',
            year: 2001,
            miles: 100000,
          },
        },
        {
          files: [],
          status: 0,
          vehicle: {
            vin: '223344556677',
            model: 'TEST MODEL 2',
            color: 'TEST COLOR 2',
            year: 2002,
            miles: 200000,
          },
        },
        {
          files: [],
          status: 0,
          vehicle: {
            vin: '334455667788',
            model: 'TEST MODEL 3',
            color: 'TEST COLOR 3',
            year: 2003,
            miles: 300000,
          },
        },
      ];
    }
  }
}
