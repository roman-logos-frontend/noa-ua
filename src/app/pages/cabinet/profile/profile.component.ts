import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AccountService } from "../../../shared/services/account/account.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AdressDialogComponent } from "../../../components/adress-dialog/adress-dialog.component";
import {IProductResponse} from "../../../shared/interfaces/product/product.interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public userForm!: FormGroup
  public user!: any;
  public city!: string;
  public street!: string;
  public entrance!: string;
  public floor!:string;
  public intercom!: string;
  public numberApartments!:string;
  public numberHouse!: string;
  public favorites: Array<IProductResponse> = [];

  constructor(
    public fb: FormBuilder,
    private router:Router,
    private accountService: AccountService,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    this.initUserForm()
    this.userData()
    this.updateUser()
    this.updateUserData()
  }

  initUserForm(): void {
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10)]],
      city: [null, Validators.required],
      address:[null, Validators.required],
      favorite:[null, Validators.required],
    });
  }


  userData():void{
    if (localStorage.length > 0 && localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser') as string);
      this.city = this.user.address.city;
      this.street = this.user.address.street;
      this.entrance = this.user.address.entrance;
      this.floor = this.user.address.floor;
      this.intercom = this.user.address.intercom;
      this.numberApartments = this.user.address.numberApartments;
      this.numberHouse = this.user.address.numberHouse;
      this.favorites = this.user.favorite;

      this.userForm.patchValue({
        email: this.user.email,
        address: this.user.address,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        phoneNumber: this.user.phoneNumber,
        uid: this.user.uid,
        city: this.user.address.city,
      });
    }
  }

  updateUser(): void {
    this.accountService.userData$.subscribe(() => {
      this.userData()
    });
  }

  updateUserData(): void {
    const {firstName,lastName,email,phoneNumber,address, favorite} = this.userForm.value;
    this.favorites = JSON.parse(localStorage.getItem('favorite') as string);
    const user = {
      address:address,
      email: email,
      firstName:firstName,
      lastName:lastName,
      phoneNumber:phoneNumber,
      role: 'USER',
      uid:this.user.uid,
      favorite: this.favorites,
    }
    this.accountService.updateUserFirebase(user, this.user.uid);
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.userData();
  }

  logout():void{
    this.router.navigate(['']);
    localStorage.removeItem('currentUser');
    this.accountService.isUserLogin$.next(true);
  }

  openDialog():void{
    this.dialog.open(AdressDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog'
    })
  }
}
