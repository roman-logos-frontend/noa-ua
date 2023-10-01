import { Injectable} from '@angular/core';
import { IProductRequest, IProductResponse } from '../../interfaces/product/product.interface';
import {
  Firestore,
  CollectionReference,
  collectionData,
  doc,
  updateDoc,
  docData,
  query, where, getDocs
} from "@angular/fire/firestore";
import { DocumentData, collection, addDoc, deleteDoc } from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  constructor(
    private afs: Firestore,
  ) {
    this.productCollection = collection(this.afs, 'product');
  }

  private productCollection!: CollectionReference<DocumentData>;


  createFirebase(product: IProductResponse){
    return addDoc(this.productCollection, product);
  }

  getAllFirebase(){
    return collectionData(this.productCollection, { idField: 'id' });
  }

  getOneFirebase(id: string){
    const productDocumentReference= doc(this.afs, `product/${id}`);
    return docData(productDocumentReference, { idField: 'id' });
  }

  updateFirebase(product: IProductRequest, id: string){
    const productDocumentReference= doc(this.afs, `product/${id}`);
    return updateDoc(productDocumentReference, {...product});
  }

  deleteFirebase(id: string){
    const productDocumentReference= doc(this.afs, `product/${id}`);
    return deleteDoc(productDocumentReference);
  }

  async getAllByCategoryFirebase(name: string) {
    const arr: DocumentData[] = [];
    const category = query(
      collection(this.afs, 'product'),
      where('category.path', '==', `${name}`)
    );
    const querySnapshot = await getDocs(category);
    querySnapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });
    return arr;
  }

}
