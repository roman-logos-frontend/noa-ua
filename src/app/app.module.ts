import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { HomeComponent } from './pages/home/home.component';
import { ProductModule } from "./pages/product/product.module";
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DonateComponent } from './pages/donate/donate.component';
import { OffertaComponent } from './pages/offerta/offerta.component';
import { JobComponent } from './pages/job/job.component';
import { JobInfoComponent } from './pages/job/job-info/job-info.component';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { SharedModule } from "./shared/shared.module";
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AdressDialogComponent } from './components/adress-dialog/adress-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DeliveryComponent,
    DonateComponent,
    OffertaComponent,
    JobComponent,
    JobInfoComponent,
    AuthDialogComponent,
    CheckoutComponent,
    AdressDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    BrowserAnimationsModule,
    SharedModule,
    ProductModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
