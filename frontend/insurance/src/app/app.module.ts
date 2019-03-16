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
import { NewClaimComponent } from './new-claim/new-claim.component';

// Auth0 Components
import { ViewClaimsComponent } from './view-claims/view-claims.component';
import { EditClaimModule } from './modules/edit-claim/edit-claim.module';
import { CoreModule } from './core/core.module';

import {MatToolbarModule} from '@angular/material';
import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NewClaimComponent,
    ViewClaimsComponent,
  ],
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
    EditClaimModule,
    AppRoutingModule,
    MatToolbarModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
