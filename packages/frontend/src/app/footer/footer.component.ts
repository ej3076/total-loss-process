import { Component, OnInit } from '@angular/core';
import { LyTheme2, ThemeVariables } from '@alyle/ui';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  light = 'minima-light';
  dark = 'minima-dark';
  private _currentTheme = this.light;
  changetheme = 'Dark Mode';

  constructor(private theme: LyTheme2 ) { }

  ngOnInit() {
  }

  toggleTheme(){
    if(this._currentTheme === this.dark){
      this._currentTheme = this.light;
      this.changetheme = 'Dark Mode';
    }

    else{
      this._currentTheme = this.dark;
      this.changetheme = 'Light Mode';
    }
    
    this.theme.setTheme(this._currentTheme);

  }

}