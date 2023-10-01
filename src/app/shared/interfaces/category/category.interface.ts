export interface ICategoryRequest {
  type:string;
  name: string;
  path: string;
  imagePath:string;
}

export interface ICategoryResponse extends ICategoryRequest{
  id: string;
}
