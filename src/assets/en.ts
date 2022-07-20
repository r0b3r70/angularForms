import { LanguageFile } from "@utils/form";

export const EN: LanguageFile = {
  validation: {
    firstName: {
      required: 'First name is required',
    },
    lastName: {
      required: 'Last name is required',
    },
    email: {
      required: 'Email address is required',
      email: 'Please enter a valid email address',
    },
    password: {
      required: 'Password is required',
      pattern: 'Use lowercase and UPPERCASE letters',
      minlength: 'Use at least 8 characters',
      invalidPassword: "Don't use your name in your password, please.",
    },
  },
  errors: {
    submit: 'Something went wrong, please try again later'
  }
};
