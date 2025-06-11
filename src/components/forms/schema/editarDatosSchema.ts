import * as Yup from 'yup';

export const editarDatosSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es requerido'),
  apellido: Yup.string()
    .min(3, 'El apellido debe tener al menos 3 caracteres')
    .required('El apellido es requerido'),
  dni: Yup.string()
    .matches(/^\d{7,8}$/, 'El DNI debe tener 7 u 8 dígitos numéricos')
    .required('El DNI es requerido'),
  email: Yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
});
