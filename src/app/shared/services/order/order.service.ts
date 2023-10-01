import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentReference,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
} from '@firebase/firestore';

import { IOrderData, IOrderDataResponse } from '../../interfaces/order/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public changeBasket = new Subject<boolean>();
  private orderCollection!: CollectionReference<DocumentData>;

  constructor(
    private afs: Firestore
  ) {
    this.orderCollection = collection(this.afs, 'orders')
  }

  createFirebase(order: IOrderData): Promise<DocumentReference<DocumentData>> {
    return addDoc(this.orderCollection, order);
  }

  getAllFirebase() {
    return collectionData(this.orderCollection, { idField: 'id' });
  }

  updateFirebase(order: IOrderDataResponse, id: string) {
    const orderDocumentReference = doc(this.afs, `orders/${id}`);
    return updateDoc(orderDocumentReference, { ...order });
  }

  deleteFirebase(id: string) {
    const orderDocumentReference = doc(this.afs, `orders/${id}`);
    return deleteDoc(orderDocumentReference);
  }

}
