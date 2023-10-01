import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ICategoryResponse } from "../../shared/interfaces/category/category.interface";
import { CategoryService } from "../../shared/services/category/category.service";
import { ImageService } from "../../shared/services/image/image.service";

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit{


  public adminCategories: Array<ICategoryResponse> = [];
  public boxStatus = true;
  public editStatus = false;
  public categoryForm!: FormGroup;
  private currentCategoryId!: string;
  public uploadPercent!: number;
  public isUploaded = false;

  constructor(
    private CategoryService: CategoryService,
    private fb: FormBuilder,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }
  //
  changeStatus(): void {
    if (this.boxStatus) {
      this.boxStatus = false;
    }
    else {
      this.boxStatus = true;
    }
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      type: [null, Validators.required],
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    });
  }


  loadCategories(): void {
    this.CategoryService.getAllFirebase().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    })
  }

  addCategory(): void {
    if (this.editStatus) {
      this.CategoryService.updateFirebase(this.categoryForm.value, this.currentCategoryId).then(() => {
        this.loadCategories();
      })
    } else {
      this.CategoryService.createFirebase(this.categoryForm.value).then(() => {
        this.loadCategories();
      })
    }
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
    this.boxStatus = true;
  }
  //
  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      type: category.type,
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    });
    this.editStatus = true;
    this.currentCategoryId = category.id;
    this.isUploaded = true;
    this.boxStatus = false;
    this.CategoryService.getOneFirebase(category.id).subscribe( data => {
      console.log(data, 'fireBase')
    })
  }
  //
  deleteCategory(category: ICategoryResponse): void {
    this.CategoryService.deleteFirebase(category.id).then(() => {
      this.loadCategories();
    })
  }
  //
  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images/categories', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
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
      this.categoryForm.patchValue({
        imagePath: null,
      });
    })
      .catch(err => {
        console.log(err);
      })
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }

}
