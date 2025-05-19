import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
});
