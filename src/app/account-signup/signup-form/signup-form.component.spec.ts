import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { User } from './user.interface';

import { SignupFormComponent } from './signup-form.component';
import { SignupFormService } from './signup-form.service';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  let mockService: jasmine.SpyObj<SignupFormService>;

  /* Get Control Helper Function */
  function gc(field): AbstractControl {
    return component.signUpForm.controls[field];
  }

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SignupFormService', ['addUser$']);
    mockService.addUser$.and.returnValue(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [SignupFormComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: SignupFormService, useValue: mockService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('Form invalid when empty', () => {
    expect(component.signUpForm.valid).toBeFalse();
  });

  it('First Name is required', () => {
    const firstName = gc('firstName');
    const errors = firstName.errors || {};
    firstName.setValue('');
    expect(errors['required']).toBeTrue();
  });

  it('Last Name is required', () => {
    const lastName = gc('lastName');
    const errors = lastName.errors || {};
    lastName.setValue('');
    expect(errors['required']).toBeTrue();
  });

  it('Email is required', () => {
    const email = gc('email');
    const errors = email.errors || {};
    email.setValue('');
    expect(errors['required']).toBeTrue();
  });

  it('Email is invalid', () => {
    const email = gc('email');
    email.setValue('test');
    const errors = email.errors || {};
    expect(errors['email']).toBeTrue();
  });

  it('Email is valid', () => {
    const email = gc('email');
    email.setValue('user@domain.com');
    const errors = email.errors || {};

    expect(errors['email']).toBeFalsy();
  });

  it('Password is required', () => {
    const password = gc('password');
    password.setValue('');
    const errors = password.errors || {};
    expect(errors['required']).toBeTrue();
  });

  it('Password pattern is invalid', () => {
    const password = gc('password');
    password.setValue('test');
    const errors = password.errors || {};
    expect(errors['pattern']).toBeTruthy();
  });

  it('Password pattern is valid', () => {
    const password = gc('password');
    password.setValue('Qwertyui');
    const errors = password.errors || {};
    expect(errors['pattern']).toBeFalsy();
  });

  it('Password matches first name', () => {
    const firstName = gc('firstName');
    const password = gc('password');
    firstName.setValue('Rob');
    password.setValue('RobErt01');
    const errors = password.errors || {};
    expect(errors['invalidPassword']).toBeTruthy();
  });

  it('Password does not match first name', () => {
    const firstName = gc('firstName');
    const password = gc('password');
    let errors = password.errors || {};
    firstName.setValue('foo');
    password.setValue('RobErt01');
    expect(errors['invalidPassword']).toBeFalsy();
  });

  it('Password does not match last name', () => {
    const lastName = gc('lastName');
    const password = gc('password');
    const errors = password.errors || {};
    lastName.setValue('foo');
    password.setValue('RobErt01');
    expect(errors['invalidPassword']).toBeFalsy();
  });

  it('Submit Form', () => {
    expect(component.signUpForm.valid).toBeFalsy();

    gc('firstName').setValue('Hello');
    gc('lastName').setValue('World');
    gc('email').setValue('hello@world.com');
    gc('password').setValue('StrongPass');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const user: User = component.signUpForm.value;

      component.onSubmit(user);
      expect(component.signUpForm.valid).toBeTruthy();
    });
  });

  it('should approve payment', fakeAsync(() => {
    expect(component.signUpForm.valid).toBeFalsy();

    gc('firstName').setValue('Hello');
    gc('lastName').setValue('World');
    gc('email').setValue('hello@world.com');
    gc('password').setValue('StrongPass');

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const user: User = component.signUpForm.value;

      component.onSubmit(user);

      expect(mockService.addUser$).toHaveBeenCalledOnceWith({
        firstName: 'Hello',
        lastName: 'World',
        email: 'hello@world.com',
        password: 'StrongPass',
      });
    });
  }));
});
