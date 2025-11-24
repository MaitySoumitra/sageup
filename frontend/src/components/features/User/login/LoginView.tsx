import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { loginUsers, setAuthState, clearError } from "./loginSlice"; // Ensure setAuthState/clearError are imported
import { useNavigate } from "react-router-dom"; // 🎯 CRITICAL: Import useNavigate
import { useEffect } from "react"; // 🎯 CRITICAL: Import useEffect

interface LoginForm {
  email: string;
  password: string;
}

export const LoginView = () => {
  const dispatch = useAppDispatch();
  // Initialize useNavigate
  const navigate = useNavigate();

  // 🎯 CRITICAL: Destructure 'redirectTo' from the state
  const { loading, error, redirectTo } = useAppSelector((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const submitLogin = (data: LoginForm) => {
    dispatch(loginUsers(data));
  };

  // 🚀 CRITICAL: Effect for redirection after successful login
  useEffect(() => {
    // Check if login succeeded AND we have a redirect path from the backend
    if (loading === 'successed' && redirectTo) {
      // Use a short delay before navigating
      const timer = setTimeout(() => {
        // Optional: You might want to clear the redirectTo state here 
        // dispatch(setAuthState(null)); // You need a specific action to just clear redirectTo if needed
        navigate(redirectTo); // 👈 Navigate to the role-specific path
      }, 500); // 0.5 second delay

      return () => clearTimeout(timer);
    }
  }, [loading, redirectTo, navigate]);

  // Optional: Effect to clear error when user starts typing again
  useEffect(() => {
    if (error) {
      // You might add logic here to clear the error after a few seconds
    }
  }, [error]);


  return (
    <div className="py-24 px-8 w-full flex justify-center">
      <div className="w-full max-w-sm rounded-lg shadow-lg p-6 bg-white border border-gray-100">
        <h3 className="text-2xl font-bold text-[#feb238] mb-8 text-center">Sign In</h3>
        <form onSubmit={handleSubmit(submitLogin)} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-gray-700">Email</label>
            <input
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#feb238] transition"
              {...register("email", { required: "Email is required" })}
              type="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-gray-700">Password</label>
            <input
              className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#feb238] transition"
              {...register("password", { required: "Password is required" })}
              type="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error} {loading === 'successed' && 'Redirecting...'}</p>}
          {loading === 'successed' && <p className="text-green-500 text-sm bg-green-50 p-2 rounded">Login successful! Redirecting...</p>}


          <button
            type="submit"
            disabled={loading === "pending"}
            className="bg-[#feb238] text-white w-full py-3 rounded-md font-semibold hover:bg-[#d69830] transition disabled:opacity-50"
          >
            {loading === "pending" ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};