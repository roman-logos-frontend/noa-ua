import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { SharedModule } from "../shared/shared.module";
import { AdminCategoryComponent } from "./admin-category/admin-category.component";
import { AdminProductComponent } from "./admin-product/admin-product.component";
import { AdminOrdersComponent } from "./admin-orders/admin-orders.component";



@NgModule({
  declarations: [
    AdminComponent,
    AdminCategoryComponent,
    AdminProductComponent,
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
