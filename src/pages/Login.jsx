import api from "../services/api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {loginSchema} from "../schemas/loginSchema.js"
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleLogin = async (e) => {e.preventDefault()
    const result = loginSchema.safeParse(formData);
    console.log(result);
      if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setErrors({});
      console.log("Valid Data");
    try {
      setLoading(true);
      const response = await api.post("/auth/login",formData);
      console.log(response.data);
      // Save JWT token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      toast.success("Login Successful!");
      console.log("====>",response.data.user.role)
      // Navigate based on user role
      if (response.data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } 
      else {
        navigate("/student/dashboard");
      }
    } 
    catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Quick Quiz Generator
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Login to your account
        </p>
        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className={`w-full mt-2 border rounded-lg p-3 outline-none focus:border-blue-500
              ${
                errors.name
                ? "border border-red-500"
                : "border border-black focus:border-blue-500"
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div className="relative">
            <label className="font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className={`w-full mt-2 border rounded-lg p-3 outline-none focus:border-blue-500
              ${
                errors.name
                  ? "border border-red-500"
                  : "border border-black focus:border-blue-500"
              }`}
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 translate-y-1/2 hover:text-blue-600"
            >
              {showPassword ? <FaEyeSlash size={20}  /> : <FaEye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white transition 
              ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center mt-6">
          Don't have an account?
          <Link
            to="/register"
            className="text-blue-600 font-semibold ml-2"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;