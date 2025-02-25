import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import axios from "axios";
import { Button, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import image from "../assets/Rectangle 6052.png";
import logo from "../assets/Social icon.png";

export default function Signup() {
  const navigate = useNavigate(); // Initialize navigation hook

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignup = async () => {
    const { fullname, username, phone, email, password, confirmPassword } = formData;

    // Validate fields
    if (!fullname || !username || !phone || !email || !password || !confirmPassword) {
      toast.error("All fields are required!", { position: "top-right", autoClose: 3000 });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!", { position: "top-right", autoClose: 3000 });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/user/register-user", {
        fullname,
        username,
        phone,
        email,
        password,
      });

      const token = response.data.token; // Assuming the token is returned in `data.token`
      console.log("Token:", response.data.token);
      
      if (token) {
        localStorage.setItem("authToken", token); // Store token for further requests
        toast.success("Account created successfully! Redirecting...", { position: "top-right", autoClose: 2000 });

        // Navigate to OTP verification screen with token
        navigate("/otp-verification", { state: { token, email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />

      {/* Left Section (Form) */}
      <div className="flex flex-1 justify-center items-center">
        <div className="w-full max-w-2xl bg-white rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create new account</h1>
          <p className="text-center text-gray-600 mb-8">Please enter your details.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullname" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <TextInput id="fullname" type="text" placeholder="Hannah Green" value={formData.fullname} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                Username
              </label>
              <TextInput id="username" type="text" placeholder="@hannahgreen76" value={formData.username} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium text-gray-700">
                Phone
              </label>
              <TextInput id="phone" type="tel" placeholder="123 465 7890" value={formData.phone} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <TextInput id="email" type="email" placeholder="qwerty@gmail.com" value={formData.email} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <TextInput id="password" type="password" placeholder="qwerty@123" value={formData.password} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <TextInput id="confirmPassword" type="password" placeholder="qwerty@123" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSignup}>
              Sign Up
            </Button>
          </div>

          <div className="mt-4">
            <Button className="w-full border border-gray-300 text-gray-700 flex items-center justify-center gap-2" outline>
              <img src={logo} alt="Google" className="w-5 h-5 me-2" />
              Sign Up with Google
            </Button>
          </div>

          <div className="mt-6 text-sm text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img src={image} alt="Signup Illustration" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}
