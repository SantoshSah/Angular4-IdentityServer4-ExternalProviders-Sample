
import {FormControl} from '@angular/forms';


export function confirmPasswordValidator (password: string) {

  let confirmPasswordControl: FormControl;
  let passwordControl: FormControl;

  return function confirmPasswordValidate (control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!confirmPasswordControl) {
      confirmPasswordControl = control;
      passwordControl = control.parent.get(password) as FormControl;
      if (!passwordControl) {
        throw new Error('confirmPasswordValidator(): other control is not found in parent group');
      }
      passwordControl.valueChanges.subscribe(() => {
        confirmPasswordControl.updateValueAndValidity();
      });
    }

    if (!passwordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      return {
        matchPassword: true
      };
    }

    return null;

  }

}
