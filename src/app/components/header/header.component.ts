import { Component, OnInit } from '@angular/core';
import { ROLE } from "../../shared/constanc/role.constanc";
import { AccountService } from "../../shared/services/account/account.service";
import { MatDialog } from "@angular/material/dialog";
import {AuthDialogComponent} from "../auth-dialog/auth-dialog.component";
import {IProductResponse} from "../../shared/interfaces/product/product.interface";
import {OrderService} from "../../shared/services/order/order.service";
import {count} from "rxjs";
import {CategoryService} from "../../shared/services/category/category.service";
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  public activeMenu!: boolean;
  public isLogin = false;
  public loginUrl = '';
  public loginPage = '';
  public basket: Array<IProductResponse> = [];
  public total = 0;
  public Count = 0;
  public activeBasket!: boolean;
  public categories: Array<ICategoryResponse> = [];
  public type = "Thai";

  constructor(
    private accountService:AccountService,
    public dialog: MatDialog,
    private orderService: OrderService,
    private categoryService: CategoryService,
  ) {
  }
  ngOnInit() {
    this.checkUserLogin();
    this.checkUpdatesUserLogin();
    this.loadBasket();
    this.updateBasket();
    this.loadCategories();
  }

  boolBurger():void{
    this.activeMenu = !this.activeMenu;
  }

  boolBasket():void{
    this.activeBasket = !this.activeBasket;
  }

  checkUserLogin():void{
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    if(currentUser && currentUser.role === ROLE.ADMIN){
      this.isLogin = true;
      this.loginUrl = 'admin';
      this.loginPage = 'Admin';
    } else if(currentUser && currentUser.role === ROLE.USER){
      this.isLogin = true;
      this.loginUrl = 'cabinet';
      this.loginPage = currentUser.firstName;
    }else {
      this.isLogin = false;
      this.loginUrl = '';
      this.loginPage = '';
    }
  }

  checkUpdatesUserLogin():void{
    this.accountService.isUserLogin$.subscribe(()=>{
      this.checkUserLogin()
    })
  }

  openLoginDialog():void{
    this.dialog.open(AuthDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog'
    })
  }


  loadBasket():void{
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice()
    this.getTotalCount()
  }

  getTotalPrice():void{
    this.total = this.basket
      .reduce((total:number, prod:IProductResponse) => total+ prod.count*prod.price, 0);
  }

  getTotalCount(): void {
    this.Count = this.basket
      .reduce((total: number, prod: IProductResponse) => total + prod.count, 0)
  }

  updateBasket():void{
    this.orderService.changeBasket.subscribe(() =>{
      this.loadBasket()
    })
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

  deleteAllProduct():void{
    this.basket.splice(0);
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.updateBasket();
    this.orderService.changeBasket.next(true);
  }


  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.categories = data as ICategoryResponse[];
    });
  }



  protected readonly count = count;
}
