import { Injectable } from '@angular/core';
import {
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentReference,
  Firestore,
  updateDoc
} from "@angular/fire/firestore";
import {IFavorite, IUser} from "../../interfaces/account/account.interfaces";
import { Subject} from "rxjs";
import {addDoc, collection, DocumentData} from "@firebase/firestore";
import {IProductResponse} from "../../interfaces/product/product.interface";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public isUserLogin$ = new Subject<boolean>();
  public userData$ = new Subject<boolean>();
  public userFavorites: IProductResponse[] = [];
  private userCollection!: CollectionReference<DocumentData>;
  private favoriteCollection!: CollectionReference<DocumentData>;
  public changeFavorite = new Subject<boolean>();
  constructor(
    private afs: Firestore,
  ) {
    this.userCollection = collection(this.afs, 'users');
    this.favoriteCollection = collection(this.afs, 'favorites');
  }

  updateUserFirebase(userInfo: IUser, id: string) {
    const accountDocumentReference= doc(this.afs, `users/${id}`);
    return updateDoc(accountDocumentReference, { ...userInfo });
  }

  getAllFirebase(){
    return collectionData(this.userCollection, { idField: 'id' });
  }

  setFavorite(product: IProductResponse): void {
    const index = this.userFavorites.findIndex(prod => prod.id === product.id);
    if(index > -1) {
      this.userFavorites.splice(index, 1);
    } else {
      this.userFavorites.push(product);
    }
    localStorage.setItem('favorite', JSON.stringify(this.userFavorites));
  }

  createFirebase(favorite: IFavorite){
    return addDoc(this.favoriteCollection, favorite);
  }

  updateFavoriteFirebase(favorite: IFavorite, id: string) {
    const accountDocumentReference= doc(this.afs, `favorite/${id}`);
    return updateDoc(accountDocumentReference, { ...favorite });
  }
}
