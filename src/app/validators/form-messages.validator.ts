export interface FormValidationMessage {
  type: string;
  message: string;
}

export const messagesErrors: FormValidationMessage[] = [
  {
    type: 'required',
    message: 'Este campo es requerido!',
  },
  {
    type: 'minlength',
    message: 'El id debe tener al menos minlength caracteres!',
  },
  {
    type: 'maxlength',
    message: 'El id no debe ser mayor a maxlength caracteres!',
  },
  {
    type: 'uniqueId',
    message: 'ID no válido!',
  },
  {
    type: 'currentDate',
    message: 'La fecha debe ser igual o mayor a la fecha actual!',
  },
];
