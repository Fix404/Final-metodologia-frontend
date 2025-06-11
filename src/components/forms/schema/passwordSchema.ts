import * as Yup from 'yup';

export const passwordSchema = Yup.object().shape({
    contraseniaActual: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
    contraseniaNueva: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
    confirmarContrasenia: Yup.string()
        .oneOf([Yup.ref('contraseniaNueva')], 'Las contraseñas no coinciden')
        .required('Debes confirmar la contraseña'),
});