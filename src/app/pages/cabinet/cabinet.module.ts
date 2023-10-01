import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetComponent } from "./cabinet.component";
import { SharedModule } from "../../shared/shared.module";
import { CabinetRoutingModule } from "./cabinet-routing.module";
import { LikedComponent } from "./liked/liked.component";
import { ChangePassComponent } from "./change-pass/change-pass.component";
import { ProfileComponent } from "./profile/profile.component";
import { HistoryComponent } from "./history/history.component";



@NgModule({
  declarations: [
    CabinetComponent,
    HistoryComponent,
    ProfileComponent,
    ChangePassComponent,
    LikedComponent
  ],
  imports: [
    CommonModule,
    CabinetRoutingModule,
    SharedModule
  ]
})
export class CabinetModule { }
