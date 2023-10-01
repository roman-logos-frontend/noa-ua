import { Component } from '@angular/core';
import {IOrderData} from "../../../shared/interfaces/order/order.interface";
import {OrderService} from "../../../shared/services/order/order.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {

  public orderData: Array<IOrderData> = [];
  public user!: string;
  public id!: string;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  async loadOrder() {
    this.orderService.getAllFirebase().subscribe((data) => {
      const user = JSON.parse(localStorage.getItem('currentUser') as string);
      this.user = user?.uid;
      data.forEach((date) => {
        const arr = date['orderProduct'];
        date['orderProduct'] = JSON.parse(arr);
        this.orderData = data as IOrderData[];
      });
    });
  }
}
