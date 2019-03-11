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

// Auth0 Components
import { CallbackComponent } from './callback/callback.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth/auth.service';
import { ViewClaimsComponent } from './view-claims/view-claims.component';
import { EditClaimComponent } from './edit-claim/edit-claim.component';
import { EditClaimModule } from './modules/edit-claim/edit-claim.module';
import { AlyleModule } from './modules/alyle/alyle.module';

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
    AlyleModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    EditClaimModule,
    AppRoutingModule,
  ],
  providers: [AuthService, CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
