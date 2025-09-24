import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { useFormik } from 'formik';
import { editarDatosSchema } from '../forms/schema/editarDatosSchema';
import { IUsuario } from '../../types/IUsuario';
import { usuariosService } from '../../services/usuarioService';
import { FiMail, FiUser } from 'react-icons/fi';
import { FaIdCard } from 'react-icons/fa';



export const EditarDatosForm = ({ onSuccess, onCancel }) => {

    const usuario = useAppSelector(state => state.auth.usuario) as IUsuario | null;
    const [isLoading, setIsLoading] = useState(false);
    const [datosUsuario, setDatosUsuario] = useState<IUsuario | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    console.log("USUARIO ID", usuario?.id)
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                if (usuario?.id) {
                    const datosUsuario = await usuariosService.obtenerUsuarioPorId(usuario.id);
                    setDatosUsuario(datosUsuario);
                    console.log("datos: ", datosUsuario)
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        fetchDatos();
    }, [usuario]);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre: datosUsuario?.nombre || '',
            apellido: datosUsuario?.apellido || '',
            dni: datosUsuario?.dni ? datosUsuario.dni.toString() : '',
            email: datosUsuario?.email || '',
        },

        validationSchema: editarDatosSchema,

        onSubmit: async (values) => {
            setIsLoading(true);
            setServerError(null);
            try {

                if (!datosUsuario?.id) {
                    console.error("No hay ID del usuario para actualizar");
                    return;
                }

                const usuarioEditado: IUsuario = {
                    ...datosUsuario,
                    ...values,
                    dni: parseInt(values.dni),
                };

                const respuesta = await usuariosService.actualizarUsuario(datosUsuario.id, usuarioEditado);
                console.log("Usuario actualizado con éxito:", respuesta);

                onSuccess();
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
            } finally {
                setIsLoading(false);
            }
        },
    });


    return (
        <>
            {serverError && (
                <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
                    {serverError}
                </div>
            )}
            <form
                className=" mt-8 space-y-6"
                onSubmit={formik.handleSubmit}>
                {/* Nombre */}
                <div >
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                        </div>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            autoComplete="nombre"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`pl-10 block w-full py-2 border ${formik.touched.nombre && formik.errors.nombre
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Tu nombre"
                        />
                    </div>
                    {formik.touched.nombre && formik.errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.nombre}</p>
                    )}
                </div>

                {/* Apellido */}
                <div >
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Apellido
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                        </div>
                        <input
                            id="apellido"
                            name="apellido"
                            type="text"
                            autoComplete="apellido"
                            value={formik.values.apellido}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`pl-10 block w-full py-2 border ${formik.touched.apellido && formik.errors.apellido
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Tu apellido"
                        />
                    </div>
                    {formik.touched.apellido && formik.errors.apellido && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.apellido}</p>
                    )}
                </div>

                {/* DNI */}
                <div>
                    <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-1">
                        DNI
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaIdCard className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="dni"
                            name="dni"
                            value={formik.values.dni}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`pl-10 block w-full py-2 border ${formik.touched.dni && formik.errors.dni
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="12345678"

                        />
                    </div>
                    {formik.touched.dni && formik.errors.dni && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.dni}</p>
                    )}
                </div>


                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo Electrónico
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`pl-10 block w-full py-2 border ${formik.touched.email && formik.errors.email
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="tu_email@ejemplo.com"
                        />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                    )}
                </div>


                {/* Botones */}
                <div className="flex space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading || !formik.isValid}
                        className="flex-1 bg-[#27548a] text-white py-2 px-4 rounded-md hover:bg-[#1e3e66] focus:outline-none focus:ring-2 focus:ring-[#27548a] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </>
    );

};