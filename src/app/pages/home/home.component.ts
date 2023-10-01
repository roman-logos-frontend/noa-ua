import {Component, OnDestroy, OnInit} from '@angular/core';
import {IProductResponse} from "../../shared/interfaces/product/product.interface";
import {Subscription} from "rxjs";
import {ProductService} from "../../shared/services/product/product.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import { ProductComponent } from "../product/product.component";
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";
import {CategoryService} from "../../shared/services/category/category.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private eventSubscription!: Subscription;
  public categories: Array<ICategoryResponse> = [];

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.eventSubscription = this.router.events.subscribe(event =>{
      if(event instanceof NavigationEnd){
        this.loadCategories();
      }
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe((data) => {
      this.categories = data as ICategoryResponse[];
    });
  }

}
