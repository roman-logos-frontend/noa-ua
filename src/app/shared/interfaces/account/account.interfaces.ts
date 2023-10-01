import {IProductRequest, IProductResponse} from "../product/product.interface";
import {IUserAddressRequest} from "../address/address.interfaces";
import {ICategoryRequest} from "../category/category.interface";

export interface ILogin{
  email:string;
  password:string;
}

export interface IUser {
  address: IUserAddressRequest;
  favorite: Array<IProductResponse>;
  email:string;
  firstName:string;
  lastName:string;
  phoneNumber:string;
}

export interface IOrderData {
  email: string
  countHolders: number;
  cash: string;
  userUID: string;
  orderProduct: Array<IProductResponse>;
  data: string;
  total: number;
  status: string;
  address: string;
  user: string;
  phone: string;
}

export interface IFavorite {
  userUID:string;
  favoriteProduct: Array<IProductRequest>;
}

export interface IFavoriteRequest extends IFavorite{
  id: string;
}



