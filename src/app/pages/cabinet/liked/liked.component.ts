import { Component } from '@angular/core';
import {  IProductResponse  } from "../../../shared/interfaces/product/product.interface";
import {  ProductService  } from "../../../shared/services/product/product.service";
import {  NavigationEnd, Router } from "@angular/router";
import {  OrderService  } from "../../../shared/services/order/order.service";
import {  Subscription  } from "rxjs";
import {AccountService} from "../../../shared/services/account/account.service";
import {IFavorite} from "../../../shared/interfaces/account/account.interfaces";
import {IOrderData} from "../../../shared/interfaces/order/order.interface";

@Component({
  selector: 'app-liked',
  templateUrl: './liked.component.html',
  styleUrls: ['./liked.component.scss']
})
export class LikedComponent {

  public userProducts: Array<IProductResponse> = [];
  private eventSubscription!: Subscription;
  public categoryName!: string;
  public user!: string;
  public id!: string;
  public userFavorites!: Array<IProductResponse>;


  constructor(
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.initUserFavorites();
  }


  initUserFavorites(): void {
    this.userFavorites = this.accountService.userFavorites;
  }

  addToFavorite(product: IProductResponse): void {
    this.accountService.setFavorite(product);
  }

  isFavorite(id: string): boolean {
    return this.accountService.userFavorites.some(prod => prod.id === id);
  }

  productCount(product: IProductResponse, value: boolean): void {
    if (value) {
      ++product.count;
    } else if (!value && product.count > 1) {
      --product.count;
    }
  }

  addToBasket(product: IProductResponse): void {
    let basket: Array<IProductResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some((prod) => prod.id === product.id)) {
        const index = basket.findIndex((prod) => prod.id === product.id);
        basket[index].count =
          Number(basket[index].count) + Number(product.count);
        console.log(typeof basket[index].count);
      } else {
        basket.push(product);
      }
    } else {
      basket.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);
  }
}
