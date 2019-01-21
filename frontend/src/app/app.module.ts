import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  LyThemeModule,
  LY_THEME,
  LY_THEME_GLOBAL_VARIABLES
} from '@alyle/ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';import { CommonModule } from '@angular/common';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconModule } from '@alyle/ui/icon';
import { LyCardModule } from '@alyle/ui/card';
import { AuthService } from './auth/auth.service';
import { LyGridModule } from '@alyle/ui/grid';
import { LyBadgeModule } from '@alyle/ui/badge';
//import {FlexLayoutModule} from '@angular/flex-layout';


/*export class GlobalVariables implements PartialThemeVariables {
  SublimeLight = {
    default: `linear-gradient(135deg, ${'#FC5C7D'} 0%,${'#6A82FB'} 100%)`,
    contrast: '#fff',
    shadow: '#B36FBC'
  }; // demo: <button ly-button raised bg="SublimeLight">Button</button>
  button = {
    root: {
      borderRadius: '2em'
    }
  };
}*/

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-dark'),
    LyButtonModule,
    LyToolbarModule,
    CommonModule,
    LyTabsModule,
    LyTypographyModule,
    LyResizingCroppingImageModule,
    LyTypographyModule,
    LyMenuModule,
    LyIconModule,
    LyCardModule,
    LyGridModule,
    LyBadgeModule
  ],
  providers: [
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
