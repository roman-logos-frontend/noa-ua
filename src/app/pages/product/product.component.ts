import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { IProductResponse} from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";
import {CategoryService} from "../../shared/services/category/category.service";
import {AccountService} from "../../shared/services/account/account.service";



@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy{

  public userProducts: Array<IProductResponse> = [];
  private eventSubscription!: Subscription;
  public categoryName!: string;
  public categories: Array<ICategoryResponse> = [];
  public activeTitle!: boolean;
  public activeList!: boolean;
  public activePage = 'Culinasia special';
  public user!: any;
  public currentFavoriteId!:string
  public favorites!: any;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private accountService: AccountService
  ) {
    this.eventSubscription = this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        this.loadProducts();
      }
    })
  }


  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories()
  }

  loadProducts(): void {
    this.categoryName = this.activatedRoute.snapshot.paramMap.get('category') as string;
    if (!this.categoryName){
      this.categoryName = 'culinasia-special'
    }
    this.productService.getAllByCategoryFirebase(this.categoryName).then(data => {
      this.userProducts = data as IProductResponse[];
    })
  }
  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.categories = data as ICategoryResponse[];
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
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

  addToFavorite(product: IProductResponse): void {
    this.accountService.setFavorite(product);
    this.favorites = JSON.parse(localStorage.getItem('favorite') as string);
    this.user = JSON.parse(localStorage.getItem('currentUser') as string);
    const {firstName,lastName,email,phoneNumber,address, favorite} = this.user;
      const user = {
        address:address,
        email: email,
        firstName:firstName,
        lastName:lastName,
        phoneNumber:phoneNumber,
        role: 'USER',
        uid:this.user.uid,
        favorite: this.favorites,
      };
    this.accountService.updateUserFirebase(user, this.user.uid);
  }

  isFavorite(id: string): boolean {
    return this.accountService.userFavorites.some(prod => prod.id === id);
  }
  change():void{
    this.activeTitle = !this.activeTitle;
    this.activeList = !this.activeList;
  }

  selectName(page: string):void{
    this.activePage = page;
  }


}
