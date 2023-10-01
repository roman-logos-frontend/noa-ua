import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@angular/fire/auth";
import { doc, Firestore, setDoc, docData } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AccountService } from "../../shared/services/account/account.service";
import { ROLE } from "../../shared/constanc/role.constanc";
import { IRegister } from "../../shared/interfaces/register/register.interface";


@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit{

  public loginForm!:FormGroup;
  public registerForm!: FormGroup;
  public isLogin!: boolean;
  public registerData!: IRegister;
  public checkPassword = false;



  constructor(
    private fb:FormBuilder,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }
  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      confirmationPassword:[null, [Validators.required]],
    })
  }
  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password).then(() => {
      console.log('login done');
    }).catch(e => {
      console.log('login error', e)
    })
  }

  async login(email: string, password: string): Promise<void> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      const currentUser = { ...user, uid: credential.user.uid };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (user && user['role'] === ROLE.USER) {
        this.router.navigate(['/cabinet']);
      }
      this.accountService.isUserLogin$.next(true);
    }, (error) => {
      console.log("error", error)
    })
  }

  registerUser():void{
    const { email, password, firstName, lastName, phoneNumber} = this.registerForm.value;
    this.registerData = this.registerForm.value;
    this.emailSignUp(email, password, firstName, lastName, phoneNumber).then(()=>{
      console.log('login created');
      this.isLogin = !this.isLogin;
      this.registerForm.reset();
    }).catch(e => {
      console.log('login error', e)
    })

  }

  async emailSignUp(email:string, password:string, firstName:string, lastName:String, phoneNumber:String): Promise<any>{
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: credential.user.email,
      firstName: this.registerData.firstName,
      lastName: this.registerData.lastName,
      phoneNumber: phoneNumber,
      address: '',
      orders: [],
      role: 'USER',
    };
    setDoc(doc(this.afs, 'users', credential.user.uid), user);
  }

  changeIsLogin():void{
    this.isLogin = !this.isLogin;
  }

  checkConfirmedPassword():void{
    this.checkPassword = this.password.value ===this.confirmed.value;
    if(this.password.value != this.confirmed.value){
      this.registerForm.controls['confirmationPassword'].setErrors({
        matchError: 'Паролі не співпадають'
      })
    }
  }

  get password(): AbstractControl{
    return this.registerForm.controls['password'];

  }
  get confirmed(): AbstractControl{
    return this.registerForm.controls['confirmationPassword'];
  }

  checkVisibilityError(control:string, name:string): boolean | null{
    return  this.registerForm.controls[control].errors?.[name]
  }
}
