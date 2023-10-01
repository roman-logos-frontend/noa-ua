import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DonateComponent } from './pages/donate/donate.component';
import { OffertaComponent } from './pages/offerta/offerta.component';
import { JobComponent } from './pages/job/job.component';
import { CheckoutComponent } from "./pages/checkout/checkout.component";

import { AuthGuard } from "./shared/guards/auth/auth.guard";
import {AdminGuard} from "./shared/guards/admin/admin.guard";


const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule)
  },

  { path: 'delivery', component: DeliveryComponent },
  { path: 'donate', component: DonateComponent },
  { path: 'checkout', component: CheckoutComponent },

  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)
  },

  { path: 'offerta', component: OffertaComponent },
  { path: 'job', component: JobComponent },

  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule)
  },

  {
    path: 'auth',
    loadChildren: () =>   import('./pages/authorization/authorization.module').then(m => m.AuthorizationModule)
  },

  {
    path: 'cabinet',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/cabinet/cabinet.module').then(m => m.CabinetModule)
  },

  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
