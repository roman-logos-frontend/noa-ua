import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../shared/services/account/account.service";
import {ROLE} from "../../shared/constanc/role.constanc";
import {Router} from "@angular/router";
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Firestore, doc, docData, setDoc} from "@angular/fire/firestore";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, OnDestroy{

  public authForm!: FormGroup;
  public loginSubscription!: Subscription

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router :Router,
    private auth : Auth,
    private afs: Firestore
  ) { }

  ngOnInit() {
    this.initAuthForm()
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  initAuthForm():void{
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  loginUser():void{
    const { email, password } = this.authForm.value;
    this.login(email, password).then(() => {
      console.log('login done')
    }).catch(e => {
      console.log('login error', e)
    })
  }
  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      const currentUser = { ...user, uid: credential.user.uid };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (user && user['role'] === ROLE.ADMIN) {
        this.router.navigate(['/admin']);
      }
      this.accountService.isUserLogin$.next(true);
    }, (error) => {
      console.log("error", error)
    })
  }

}
