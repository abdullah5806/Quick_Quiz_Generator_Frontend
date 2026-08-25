import api from "../services/api.js";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import { registerSchema } from "../schemas/registerSchema.js";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });
  const [errors, setErrors] = useState({});
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
  const handleRegister = async (e) => {e.preventDefault()
    const result = registerSchema.safeParse(formData);
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
      const response = await api.post("/auth/register",formData);
      console.log(response.data);
      toast.success("Registration Successful!");
      navigate("/");
    } 
    catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Quick Quiz Generator
        </h1>
        <p className="text-center text-gray-500 ">
          Create your account
        </p>
        <form onSubmit={handleRegister} noValidate className=" space-y-5">
          <div>
            <label className="font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className={`w-full mt-1 rounded-lg p-3 outline-none
              ${
                errors.name
                  ? "border border-red-500"
                  : "border border-black focus:border-blue-500"
              }`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className={`w-full mt-1 border rounded-lg p-3 outline-none focus:border-blue-500
                ${
                errors.email
                  ? "border border-red-500"
                  : "border border-black focus:border-blue-500"
                }
              `}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className={`w-full mt-1 border rounded-lg p-3 outline-none focus:border-blue-500
                ${
                errors.password
                  ? "border border-red-500"
                  : "border border-black focus:border-blue-500"
                }  
              `}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label className="font-medium">
              Role
            </label>
            <select
            name="role"
              className="w-full mt-1 border rounded-lg p-3 outline-none focus:border-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Student">Student</option>
              <option value="Teacher">Instructor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-6">
          Already have an account?
          <Link
            to="/"
            className="text-blue-600 font-semibold ml-2"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;