import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { setValidationMessageAbstract, trackFieldValidationAbstract } from '@utils/form';
import { passwordValidator, dualCasePattern } from '@utils/form/validation';
import { SignupFormService } from './signup-form.service';
import { User } from './user.interface';
import { EN } from 'src/assets/en';

@Component({
  selector: 'app-signup-form',
  template: `<div class="form-container">
    <form class="sign-up-form" [formGroup]="signUpForm" (ngSubmit)="onSubmit(signUpForm.value)" novalidate>
      <mat-card *ngIf="!formState.submitted">
        <mat-card-header>
          <mat-card-title>Create a new account</mat-card-title>
          <mat-card-subtitle>Sign up to create a new account using the form below.</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field class="full-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="First Name" required />
            <mat-error *ngIf="formState.formErrors['firstName']">
              {{ formState.formErrors['firstName'] }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Last Name" required />
            <mat-error *ngIf="formState.formErrors['lastName']">
              {{ formState.formErrors['lastName'] }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="user@domain.com" required />
            <mat-error *ngIf="formState.formErrors['email']">
              {{ formState.formErrors['email'] }}
            </mat-error>
          </mat-form-field>

          <mat-form-field class="full-width">
            <mat-label>Password</mat-label>
            <input
              matInput
              formControlName="password"
              type="password"
              [type]="formState.showPassword ? 'text' : 'password'"
              required
            />
            <button
              mat-icon-button
              matSuffix
              (click)="formState.showPassword = !formState.showPassword"
              type="button"
              [attr.aria-label]="'Hide password'"
              [attr.aria-pressed]="formState.showPassword"
            >
              <mat-icon>{{ formState.showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>

            <mat-error *ngIf="formState.formErrors['password']">
              {{ formState.formErrors['password'] }}
            </mat-error>
          </mat-form-field>
        </mat-card-content>

        <mat-card-actions>
          <button type="submit" mat-raised-button color="primary" [disabled]="signUpForm.invalid || formState.submitted">
            Sign Up
          </button>
          <button type="button" (click)="preFill()" mat-raised-button color="secondary">I'm feeling lazy</button>
        </mat-card-actions>
        <mat-error *ngIf="formState.submitError">
          {{ formState.submitError }}
        </mat-error>
      </mat-card>

      <mat-card *ngIf="formState.submitted">
        <mat-card-header>
          <mat-card-title>Thanks for signing up!</mat-card-title>
          <mat-card-subtitle>Please check your mailbox and confirm your e-mail address</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="gif"></div>
        </mat-card-content>
      </mat-card>
    </form>
  </div> `,
  styles: [
    `
      .form-container {
        padding: 25px;
        width: auto;
      }

      .sign-up-form {
        min-width: 150px;
        max-width: 500px;
        margin: 0 auto;
      }

      .full-width {
        width: 100%;
      }

      .mat-card-header {
        text-align: center;
      }

      .mat-card-header-text {
        width: 100%;
      }

      mat-card-header {
        justify-content: center;
      }

      .mat-form-field {
        padding: 5px 0;
      }

      .gif {
        display: block;
        padding: 20px;
        border-radius: 50%;
        height: 180px;
        width: 180px;
        position: relative;
        background: url(https://media.giphy.com/media/6nuiJjOOQBBn2/giphy.gif) no-repeat;
        background-size: cover;
        background-position: center;
        margin: 0 auto;
      }
    `,
  ],
})
export class SignupFormComponent implements OnInit, OnDestroy {
  public readonly formState = {
    submitted: false,
    submitError: '',
    formErrors: {},
    showPassword: false,
  };

  /* Using form builder to setup the form
  */
  private formConfig = {
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]],
    password:  ['', [Validators.required, Validators.minLength(8), Validators.pattern(dualCasePattern), passwordValidator]],
  };

  signUpForm: FormGroup = this.fb.group(this.formConfig);

  /* Setup from abstract functions
  */
  private fieldTrackers = new Subscription();
  private trackFieldValidation = trackFieldValidationAbstract(
    this.fieldTrackers,
    this.signUpForm,
    setValidationMessageAbstract(this.formState.formErrors, EN),
  );

  constructor(private fb: FormBuilder, private formService: SignupFormService) {}

  ngOnInit(): void {
    this.trackFieldValidation(this.formConfig);
  }

  ngOnDestroy(): void {
    this.fieldTrackers.unsubscribe();
  }

  preFill() {
    this.signUpForm.setValue({ firstName: 'hello', lastName: 'world', email: 'hello@world.com', password: 'fooBAR123', });
  }

  onSubmit(value: User): void {
    if (!this.signUpForm.valid) {
      return;
    }
    this.formService.addUser$(value).subscribe({
      next: () => {
        this.formState.submitted = true;
        this.fieldTrackers.unsubscribe();
      },
      error: () => (this.formState.submitError = EN['errors'].submit),
    });
  }
}
