import * as Yup from 'yup';

export const registroSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es requerido'),
  email: Yup.string()
    .email('El email no es válido')
    .required('El email es requerido'),
  contrasenia: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmarContrasenia: Yup.string()
    .oneOf([Yup.ref('contrasenia')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
});
