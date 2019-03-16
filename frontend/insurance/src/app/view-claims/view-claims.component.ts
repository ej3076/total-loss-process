import { Component, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';
import { MiddlewareService } from '../core/services/middleware/middleware.service';

const alyleStyle = (theme: ThemeVariables) => ({
  paper: {
    display: 'block',
    margin: '.2em',
    padding: '.8em',
  },
  noClaims: {
    display: 'block',
    margin: '3rem auto auto auto',
    padding: '1em',
  },
  claim: {
    padding: '16px',
    borderRadius: '4px',
  },
  claimLink: {
    color: theme.primary.default,
    '&:hover': {
      color: theme.warn.default,
    },
  },
});

@Component({
  selector: 'app-view-claims',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss'],
})
export class ViewClaimsComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(alyleStyle);

  errorText = '';
  responseError = false;

  private claims: Protos.Claim[] = [];

  constructor(
    private _theme: LyTheme2,
    private middlewareService: MiddlewareService,
  ) {}

  ngOnInit() {
    this.setClaims();
  }

  setClaims(): void {
    this.middlewareService.getClaims().subscribe(
      result => {
        this.claims = [...result];
      },
      error => {
        this.responseError = true;
        this.errorText = error;
      },
    );
  }

  sortClaims(num: number): Protos.Claim[] {
    return this.claims.filter(claim => claim.status === num);
  }
}
