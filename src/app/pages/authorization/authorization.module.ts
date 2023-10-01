import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { AuthorizationComponent } from "./authorization.component";
import { ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [
    AuthorizationComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AuthorizationModule { }
