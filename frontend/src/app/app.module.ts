//Angular Components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';

//Created Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NewClaimComponent } from './new-claim/new-claim.component';

//Alyle Components
import { LyButtonModule } from '@alyle/ui/button';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyIconModule } from '@alyle/ui/icon';
import { LyCardModule } from '@alyle/ui/card';
import { LyGridModule } from '@alyle/ui/grid';
import { LyBadgeModule } from '@alyle/ui/badge';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { LyThemeModule, LyCommonModule, PartialThemeVariables, LY_THEME, LY_THEME_GLOBAL_VARIABLES } from '@alyle/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LyFieldModule } from '@alyle/ui/field';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyCheckboxModule } from '@alyle/ui/checkbox';

//Auth0 Components
import { CallbackComponent } from './callback/callback.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';

export class CustomMinimaLight extends MinimaLight {
  primary = {
    default: '#0978BC',
    contrast: '#fff'
  };
  accent = {
    default: '#333333',
    contrast: '#fff'
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff'
  };
  secondary = {
    default: '#102B4E',
    contrast: '#fff'
  };
}

export class CustomMinimaDark extends MinimaDark {
  primary = {
    default: '#102B4E',
    contrast: '#fff'
  };
  accent = {
    default: '#0978BC',
    contrast: '#fff'
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff'
  };
  secondary = {
    default: '#DDDDDD',
    contrast: '#000'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CallbackComponent,
    NewClaimComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LyThemeModule.setTheme('minima-light'),
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
    LyBadgeModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LyFieldModule,
    LyRadioModule,
    LyCheckboxModule
  ],
  providers: [
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    AuthService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
