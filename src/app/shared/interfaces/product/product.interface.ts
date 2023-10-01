import { ICategoryResponse } from "../category/category.interface";

export interface IProductRequest{
  category: ICategoryResponse;
  name:string;
  path:string;
  description:string;
  weight:number;
  price:number;
  imagePath:string;
  count: number;
  allergies: string;
}

export interface IProductResponse extends IProductRequest{
  id: string;
}
