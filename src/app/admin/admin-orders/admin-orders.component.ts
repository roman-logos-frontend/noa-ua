import {Component, OnInit} from '@angular/core';
import {IOrderDataResponse} from "../../shared/interfaces/order/order.interface";
import {OrderService} from "../../shared/services/order/order.service";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent  implements OnInit{

  public orderData: Array<IOrderDataResponse> = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  async loadOrder() {
    this.orderService.getAllFirebase().subscribe((data) => {
      data.forEach((date) => {
        const arr = date['orderProduct'];
        date['orderProduct'] = JSON.parse(arr);
        this.orderData = data as IOrderDataResponse[];
      });
    });
  }


  orderUpdate(order: IOrderDataResponse): void {
    order.status =  ' виконано';
    order.orderProduct = JSON.stringify(order.orderProduct) as any,

      this.orderService
        .updateFirebase(order, order.id as string)
        .then((data) => {
        });
  }
}
