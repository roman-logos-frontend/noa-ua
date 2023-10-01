import { IProductResponse } from '../product/product.interface';

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
export interface IOrderDataResponse extends IOrderData {
  id:string;
}
