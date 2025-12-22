import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
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
     
     await createUserWithEmailAndPassword(auth, form.email, form.password);
      // alert("Signup successful");
      toast.success("Signup successful");
      navigate("/");
    } catch (error: any) {
    //   console.log("Firebase Auth Error:", error.code);

      if (error.code === "auth/user-not-found") {
        setErrors({ auth: "User not found. Please sign up first." });
      } else if (error.code === "auth/wrong-password") {
        setErrors({ auth: "Incorrect password." });
      } else if (error.code === "auth/invalid-email") {
        setErrors({ auth: "Invalid email address." });
      } else {
        setErrors({ auth: "Signup failed. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow pt-16">
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold">Signup</h1>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="mt-4">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          {errors.auth && <p className="text-red-500 mt-2">{errors.auth}</p>}

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            {loading ? "Logging in..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
