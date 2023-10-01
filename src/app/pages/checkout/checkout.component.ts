import {Component, OnInit} from '@angular/core';
import {IProductResponse} from "../../shared/interfaces/product/product.interface";
import {OrderService} from "../../shared/services/order/order.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import {count} from "rxjs";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit{

  public basket: Array<IProductResponse> = [];
  public total = 0;
  public orderForm!: FormGroup
  public user!: any;
  public active!: boolean;
  public activeTitle!: boolean;
  public activeList!: boolean;
  public activePage = 'Ресторан за адресою';

  constructor(
    public fb: FormBuilder,
    private orderService: OrderService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadBasket();
    this.updateBasket();
    this.initOrderForm();
    this.userData();
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10)]],
      email: [null, [Validators.required, Validators.email]],
      countHolders: [1],
      cash: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }

  userData():void{
    if (localStorage.length > 0 && localStorage.getItem('currentUser')) {
      const {firstName,lastName,email,phoneNumber,address} = JSON.parse(localStorage.getItem('currentUser') as string);
      this.orderForm.patchValue({
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      });
    }else if(localStorage.length == 0){
      this.orderForm.patchValue({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
    }
  }

  productCount(product: IProductResponse, value: boolean):void{
    if(value){
      ++product.count
    }else if(!value && product.count > 1){
      --product.count
    }
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.changeBasket.next(true);
    this.updateBasket();
  }


  loadBasket():void{
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice()
  }

  updateBasket():void{
    this.orderService.changeBasket.subscribe(() =>{
      this.loadBasket()
    })
  }

  getTotalPrice():void{
    this.total = this.basket
      .reduce((total:number, prod:IProductResponse) => total+ prod.count*prod.price, 0);
  }

  deleteProduct(product: IProductResponse): void {
    if (this.basket.some((prod) => prod.id === product.id)) {
      let index = this.basket.findIndex(
        (prod) => prod.id === product.id
      );
      this.basket.splice(index, 1);
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.updateBasket();
      this.orderService.changeBasket.next(true);
    }
  }

  addOrder():void{
    const { countHolders, delivery, cash, } =
      this.orderForm.value;
    this.user = JSON.parse(localStorage.getItem('currentUser') as string);

    const orderData = {
      email: this.user.email,
      countHolders: countHolders,
      cash: cash,
      orderProduct: JSON.stringify(this.basket) as any,
      data: String(new Date()),
      total: this.total,
      status: ' впроцесі',
      userUID: this.user.uid,
      address: this.activePage,
      user: this.user.firstName +' '+ this.user.lastName,
      phone:this.user.phoneNumber,
    }

    this.orderService.createFirebase(orderData);
    this.clearBasket();
  }

  clearBasket(): void {
    this.basket = [];
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.updateBasket();
    this.orderService.changeBasket.next(true);
    localStorage.removeItem('basket');
    this.orderForm.reset();
    this.router.navigate(['/cabinet/history']);
  }

  change():void{
    this.activeTitle = !this.activeTitle;
    this.activeList = !this.activeList;
  }


  selectName(page: string):void{
    this.activePage = page;
  }

  protected readonly count = count;
}
