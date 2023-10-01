import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import { ICategoryRequest, ICategoryResponse } from '../../interfaces/category/category.interface';
import { Observable } from 'rxjs';
import { Firestore, CollectionReference, addDoc, collectionData, doc, updateDoc, deleteDoc, docData} from "@angular/fire/firestore";
import { DocumentData, collection } from "@firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryCollection!: CollectionReference<DocumentData>;

  constructor(
    private http: HttpClient,
    private afs: Firestore,

  ) {
    this.categoryCollection = collection(this.afs, 'categories');
  }


  createFirebase(category: ICategoryRequest){
    return addDoc(this.categoryCollection, category);
  }

  getAllFirebase(){
    return collectionData(this.categoryCollection, { idField: 'id' });
  }

  getOneFirebase(id: string){
    const categoryDocumentReference= doc(this.afs, `categories/${id}`);
    return docData(categoryDocumentReference, { idField: 'id' });
  }

  updateFirebase(category: ICategoryRequest, id: string){
    const categoryDocumentReference= doc(this.afs, `categories/${id}`);
    return updateDoc(categoryDocumentReference, {...category});
  }

  deleteFirebase(id: string){
    const categoryDocumentReference= doc(this.afs, `categories/${id}`);
    return deleteDoc(categoryDocumentReference);
  }
}
