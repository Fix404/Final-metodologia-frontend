import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  username: yup.string().required("El usuario es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria"),
});

type FormData = yup.InferType<typeof schema>;

export const SignInScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Datos del formulario:", data);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 h-96 bg-[#27548A] rounded-lg shadow-lg p-8 flex flex-col justify-between"
      >
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Iniciar Sesión
        </h2>

        <input
          {...register("username")}
          placeholder="Usuario"
          className="w-full p-2 mb-2 rounded border border-gray-300 text-white"
        />
        {errors.username && (
          <p className="text-red-200 text-sm mb-3">{errors.username.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-2 rounded border border-gray-300"
        />
        {errors.password && (
          <p className="text-red-200 text-sm mb-3">{errors.password.message}</p>
        )}


        <input
          {...register("password")}
          type="password"
          placeholder="Repita la contraseña"
          className="w-full p-2 mb-2 rounded border border-gray-300"
        />
        {errors.password && (
          <p className="text-red-200 text-sm mb-3">{errors.password.message}</p>
        )}
        <button
          type="submit"
          className="w-full bg-white text-[#27548A] font-bold py-2 rounded hover:bg-gray-200 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};
