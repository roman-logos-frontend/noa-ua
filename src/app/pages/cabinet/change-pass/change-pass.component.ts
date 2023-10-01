import { Component } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent {

  public passwordForm!: FormGroup;


  constructor(
    private fb:FormBuilder,
  ) {}
  ngOnInit() {
    this.initPasswordForm()
  }

  initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

}
