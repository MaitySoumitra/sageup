import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { loginUsers } from "./loginSlice";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginView = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const submitLogin = (data: LoginForm) => {
    dispatch(loginUsers(data));
  };

  return (
    <div className="py-24 px-8 w-full">
      <div className="overflow-hidden">
        <div className="p-2 w-full">
          <h3 className="text-xl font-semibold text-[#feb238] mb-6">Login Page</h3>
          <form onSubmit={handleSubmit(submitLogin)} className="space-y-6">
            {/* Email */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Email</label>
              <input
                className="border rounded-md px-4 py-2 focus:outline-none focus:border-yellow-600"
                {...register("email", { required: "Email is required" })}
                type="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Password</label>
              <input
                className="border rounded-md px-4 py-2 focus:outline-none focus:border-yellow-600"
                {...register("password", { required: "Password is required" })}
                type="password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading === "pending"}
              className="bg-black text-[#C4872B] w-full py-3 rounded-md hover:bg-neutral-900 transition"
            >
              {loading === "pending" ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
