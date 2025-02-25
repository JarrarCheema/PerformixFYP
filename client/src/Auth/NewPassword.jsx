import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";  // Import axios for API requests
import image from "../assets/Rectangle 6052.png";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation(); // Get token from URL state
  const { token } = state;  // Get the token
console.log(token);

  const handleResetPassword = async () => {
    // Validate if both password fields are filled
    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Send the password reset request to the backend API
      const response = await axios.post(
        `http://localhost:8080/user/update-password/${token}`,
        { newPassword: newPassword }
      );

      // Show success toast
      toast.success("Password reset successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect to login screen after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Navigate after 3 seconds
    } catch (error) {
      // Handle errors, e.g., token expiration or invalid token
      toast.error(error.response?.data?.message || "Error occurred, please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer /> {/* Toast container for notifications */}

      {/* Left Section */}
      <div className="flex flex-1 flex-col justify-center items-center px-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-4">
            Create a New Password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Please enter a new password to secure your account
          </p>

          {/* New Password Field */}
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <TextInput
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <TextInput
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Reset Password Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4"
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>

          {/* Back to Login Link */}
          <div className="mt-6 text-sm text-center text-gray-700">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img
          src={image}
          alt="Password Reset Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
