import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newErrors: any = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password.trim()
      );
      // await createUserWithEmailAndPassword(auth, form.email, form.password);
      // alert("Login successful");
      toast.success("Login successful");
      navigate("/add-blog");
    } catch (error: any) {
      //   console.log("Firebase Auth Error:", error.code);

      if (error.code === "auth/user-not-found") {
        setErrors({ auth: "User not found. Please sign up first." });
      } else if (error.code === "auth/wrong-password") {
        setErrors({ auth: "Incorrect password." });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ auth: "Invalid email address." });
      } else {
        setErrors({ auth: "Login failed. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 z-50">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">RP SoftTech</h1>
            <p className="text-sm text-gray-500 mt-1">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>

            {errors.auth && <p className="text-red-500 mt-2">{errors.auth}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Login
            </button>
          </form>
          
        </div>
      </div>
    </>
  );
};

export default Login;
