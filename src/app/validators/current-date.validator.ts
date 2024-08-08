import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function currentDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlDate = new Date(control.value);
    const currentDate = new Date();
    controlDate.setUTCHours(0, 0, 0, 0);
    currentDate.setUTCHours(0, 0, 0, 0);
    return controlDate < currentDate ? { currentDate: true } : null;
  };
}
