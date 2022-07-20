import { AbstractControl, AbstractControlOptions, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormErrorMessages, LanguageFile } from './form-helper.interface';

interface Fields {
  [k: string]: Array<AbstractControlOptions>;
}

/**
 * Returns a function that can be used in a component to set validation messages.
 * The output function is consumed as parameter in trackFieldValidation
 * It can display multiple errors for one field simultaneously
 *
 * @param formErrorMessages reference to error messages object
 * @param langFile language file containing error messages
 */
export function setValidationMessageAbstract(
    formErrorMessages: FormErrorMessages,
    langFile: LanguageFile
  ): Function {
    return (field: string, control: AbstractControl): void => {
      formErrorMessages[field] = '';
      if ((control.touched || control.dirty) && control.errors) {
        formErrorMessages[field] = Object.keys(control.errors)
          .map((key) => (formErrorMessages[field] = langFile['validation'][field][key]))
          .join('. ');
      }
    };
}

/**
 * Returns a function that can be used in a component to track status changes if individual form components.
 * From there it uses (a reference to) setValidationMessage to compose the validation message.
 *
 * @param fieldTrackers reference to subscription variable in the component so it can unsubscribe.
 * @param formGroup reference to fb.group
 * @param setValMsgFn reference to setValidationMessage function, returned by setValidationMessageAbstract() in the controller.
 */
export function trackFieldValidationAbstract(
  fieldTrackers: Subscription,
  formGroup: FormGroup,
  setValMsgFn: Function,
): Function {
  return (fields: Fields): void => {
    for (const field of Object.keys(fields)) {
      const sub = formGroup.get(field)?.statusChanges.subscribe(() => setValMsgFn(field, formGroup.get(field)));
      fieldTrackers.add(sub);
    }
  };
}
