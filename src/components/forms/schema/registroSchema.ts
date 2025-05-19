import * as Yup from 'yup';

export const registroSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
});
