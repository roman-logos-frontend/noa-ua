import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from "./product.component";
import { ProductInfoResolver } from "../../shared/services/product/product-info.resolver";
import { ProductInfoComponent } from "./product-info/product-info.component";


const routes: Routes = [
  { path: '', redirectTo:'culinasia-special', pathMatch:'full'},

  {path: ':category', component: ProductComponent},

  {path: ':category/:id', component: ProductInfoComponent,
    resolve: {
      productInfo: ProductInfoResolver
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
