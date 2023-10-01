import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from "./cabinet.component";
import { ProfileComponent } from "./profile/profile.component";
import { HistoryComponent } from "./history/history.component";
import { ChangePassComponent } from "./change-pass/change-pass.component";
import { LikedComponent } from "./liked/liked.component";


const routes: Routes = [
  {
    path: '',
    component:  CabinetComponent,
    children:[
      { path: 'profile', component: ProfileComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'changePass', component:ChangePassComponent },
      { path: 'liked', component:LikedComponent },

      { path: '', pathMatch: 'full', redirectTo: 'profile' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule { }
