import { Component, OnInit } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

const STYLES = {
  paper: {
    display: 'block',
    margin: '.5em',
    padding: '1em'
  }
};

@Component({
  selector: 'app-view-claims',
  templateUrl: './view-claims.component.html',
  styleUrls: ['./view-claims.component.scss']
})
export class ViewClaimsComponent implements OnInit {
  readonly classes = this._theme.addStyleSheet(STYLES);
  constructor(private _theme: LyTheme2) { }

  ngOnInit() {
  }

}
