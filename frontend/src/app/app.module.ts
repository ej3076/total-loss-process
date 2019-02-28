// Angular Components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Created Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NewClaimComponent } from './new-claim/new-claim.component';

// Alyle Components
import { LyBadgeModule } from '@alyle/ui/badge';
import { LyButtonModule } from '@alyle/ui/button';
import { LyCardModule } from '@alyle/ui/card';
import { LyCarouselModule } from '@alyle/ui/carousel';
import { LyCheckboxModule } from '@alyle/ui/checkbox';
import { LyDrawerModule } from '@alyle/ui/drawer';
import { LyFieldModule } from '@alyle/ui/field';
import { LyGridModule } from '@alyle/ui/grid';
import { LyIconModule } from '@alyle/ui/icon';
import { LyMenuModule } from '@alyle/ui/menu';
import { LyRadioModule } from '@alyle/ui/radio';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyTabsModule } from '@alyle/ui/tabs';
import { LyThemeModule, LY_THEME } from '@alyle/ui';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyTypographyModule } from '@alyle/ui/typography';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

// Auth0 Components
import { CallbackComponent } from './callback/callback.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { ViewClaimsComponent } from './view-claims/view-claims.component';
import { EditClaimComponent } from './edit-claim/edit-claim.component';

export class CustomMinimaLight extends MinimaLight {
  primary = {
    default: '#0978BC',
    contrast: '#fff',
  };
  offPrimary = {
    default: '#0978BC',
    contrast: '#fff',
  }
  accent = {
    default: '#FFFFFF',
    contrast: '#000',
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff',
  };
  secondary = {
    default: '#102B4E',
    contrast: '#fff',
  };
}

export class CustomMinimaDark extends MinimaDark {
  primary = {
    default: '#0978BC',
    contrast: '#fff',
  };
  offPrimary = {
    default: '#FFFFFF',
    contrast: '#0978BC',
  }
  accent = {
    default: '#FFFFFF',
    contrast: '#000',
  };
  warn = {
    default: '#D92E14',
    contrast: '#fff',
  };
  secondary = {
    default: '#DDDDDD',
    contrast: '#000',
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CallbackComponent,
    NewClaimComponent,
    ViewClaimsComponent,
    EditClaimComponent,
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
    LyCheckboxModule,
    LyDrawerModule,
    LyCarouselModule,
  ],
  providers: [
    { provide: LY_THEME, useClass: CustomMinimaLight, multi: true },
    { provide: LY_THEME, useClass: CustomMinimaDark, multi: true },
    AuthService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
