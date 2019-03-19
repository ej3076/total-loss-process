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
import { HomeComponent } from './modules/home/home.component';

// Auth0 Components
import { CoreModule } from './core/core.module';

// Material
import { MatToolbarModule } from '@angular/material';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './shared/shared.module';
import { ViewClaimsModule } from './modules/view-claims/view-claims.module';
import { EditClaimModule } from './modules/edit-claim/edit-claim.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    CommonModule,
    CoreModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    ViewClaimsModule,
    EditClaimModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
