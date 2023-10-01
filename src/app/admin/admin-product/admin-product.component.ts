import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { ICategoryResponse } from 'src/app/shared/interfaces/category/category.interface';
import { ImageService } from 'src/app/shared/services/image/image.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  public productForm!: FormGroup;
  public adminProducts: Array<IProductResponse> = [];
  public adminCategories: Array<ICategoryResponse> = [];
  public editStatus = false;
  public isOpen = false;
  private currentProductId!: string;
  public uploadPercent = 0;
  public isUploaded = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProduct();
    this.initProductForm();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      description: [null, Validators.required],
      allergies: [null],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      imagePath: [null, Validators.required],
      count: 1
    });
  }

  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({
        category: this.adminCategories[0].id
      })
    })
  }

  loadProduct(): void {
    this.productService.getAllFirebase().subscribe(data => {
      this.adminProducts = data as IProductResponse[];
    })
  }

  addProduct(): void {
    if (this.editStatus) {
      this.productService.updateFirebase(this.productForm.value, this.currentProductId).then(() => {
        this.loadProduct();
        this.isOpen = false;
        this.editStatus = false;
        this.isUploaded = false;
      })
    } else {
      this.productService.createFirebase(this.productForm.value).then(() => {
        this.loadProduct();
        this.isOpen = false;
        this.editStatus = false;
        this.isUploaded = false;
      })
    }
    this.productForm.reset()
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      description: product.description,
      allergies: product.allergies,
      weight: product.weight,
      price: product.price,
      imagePath: product.imagePath
    });
    this.isOpen = true;
    this.isUploaded = true;
    this.editStatus = true;
    this.currentProductId = product.id;
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.deleteFirebase(product.id as string).then(() => {
      this.loadProduct();
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/products', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath')).then(() => {
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.productForm.patchValue({
        imagePath: null,
      });
    })
      .catch(err => {
        console.log(err);
      })
  }

  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }

  toggleOpenForm(): void {
    this.isOpen = !this.isOpen;
  }
}

