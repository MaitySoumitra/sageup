
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { registerUser, clearRegisterState } from "./registerSlice";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  phone?: string;
}

export const RegisterView = () => {
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.register);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  const submitHandler = (data: RegisterForm) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="py-24 px-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#feb238]">Register</h2>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="font-medium">Name</label>
          <input
            type="text"
            className="border rounded-md px-4 py-2 w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="font-medium">Email</label>
          <input
            type="email"
            className="border rounded-md px-4 py-2 w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="font-medium">Password</label>
          <input
            type="password"
            className="border rounded-md px-4 py-2 w-full"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="font-medium">Role</label>
          <select
            className="border rounded-md px-4 py-2 w-full"
            {...register("role", { required: "Role is required" })}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="font-medium">Phone (optional)</label>
          <input
            type="text"
            className="border rounded-md px-4 py-2 w-full"
            {...register("phone")}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

        <button
          type="submit"
          disabled={loading === "pending"}
          className="bg-black text-[#C4872B] w-full py-3 rounded-md hover:bg-neutral-900 transition"
        >
          {loading === "pending" ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};
