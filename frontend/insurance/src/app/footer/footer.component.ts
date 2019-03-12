import { Component } from '@angular/core';
import { LyTheme2 } from '@alyle/ui';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  private themes = {
    light: 'minima-light',
    dark: 'minima-dark',
  };
  private currentTheme = this.themes.light;

  constructor(private theme: LyTheme2) {}

  get buttonText() {
    return this.currentTheme === this.themes.light ? 'Dark Mode' : 'Light Mode';
  }

  toggleTheme() {
    this.currentTheme =
      this.currentTheme === this.themes.light
        ? this.themes.dark
        : this.themes.light;
    this.theme.setTheme(this.currentTheme);
  }
}
