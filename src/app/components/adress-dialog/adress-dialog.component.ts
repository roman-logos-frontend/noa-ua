import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../shared/services/account/account.service";
import {IProductResponse} from "../../shared/interfaces/product/product.interface";

@Component({
  selector: 'app-adress-dialog',
  templateUrl: './adress-dialog.component.html',
  styleUrls: ['./adress-dialog.component.scss']
})
export class AdressDialogComponent implements OnInit {

  public userAddress!: FormGroup;
  public user!: any;
  public uid!: string;
  public email!: string;
  public firstName!:string;
  public lastName!:string;
  public phoneNumber!: string;
  public favorite: Array<IProductResponse> = [];


  ngOnInit() {
    this.initUserAddress();
    this.userData();
  }

  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private accountService: AccountService,
    ) {}

  initUserAddress(): void {
    this.userAddress = this.fb.group({
      city: [null, Validators.required],
      street: [null, Validators.required],
      numberHouse: [null, Validators.required],
      numberApartments: [null, Validators.required],
      entrance: [null, Validators.required],
      floor: [null, Validators.required],
      intercom: [null, Validators.required],
    });
  }

  userData():void {
    if (localStorage.length > 0 && localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser') as string);
      this.email = this.user.email;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.phoneNumber = this.user.phoneNumber;
      this.uid = this.user.uid;
      this.favorite = this.user.favorite;

      this.userAddress.patchValue({
        city: this.user.address.city,
        street: this.user.address.street,
        numberHouse: this.user.address.numberHouse,
        numberApartments: this.user.address.numberApartments,
        entrance: this.user.address.entrance,
        floor: this.user.address.floor,
        intercom: this.user.address.intercom,
      });
    }
  }

  updateUserData(): void {
    const { city, street, numberHouse, numberApartments, entrance, floor, intercom} = this.userAddress.value;
    const address = {
      city: city,
      street: street,
      numberHouse: numberHouse,
      numberApartments: numberApartments,
      entrance: entrance,
      floor: floor,
      intercom: intercom,
    }

    const user = {
      address: address,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      role: 'USER',
      uid:this.user.uid,
      favorite: this.favorite,
    }

    this.accountService.updateUserFirebase(user, this.user.uid);
    localStorage.setItem(`currentUser`, JSON.stringify(user));
    this.closeDialog();
  }

  closeDialog():void{
    this.dialog.closeAll()
  }

}
