import { Component } from '@angular/core';
import { Router } from "@angular/router";
import {AccountService} from "../shared/services/account/account.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  constructor(
    private router:Router,
    private accoutService:AccountService
  ) {
  }

  logout(){
    this.router.navigate(['']);
    localStorage.removeItem('currentUser');
    this.accoutService.isUserLogin$.next(true);
  }
}
