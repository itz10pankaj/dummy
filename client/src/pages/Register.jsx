import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { registerUser,googleLoginUser } from '../services/apiServices';
const Register = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role:'user'
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: null, longitude: null });

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location error:", error);
        toast.error("Location access denied!", { autoClose: 2000 });
      }
    );
  }
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser({
        ...values,
        latitude: location.latitude,
        longitude: location.longitude
      });

      // console.log("Registration Successful:", response.data);
      toast.success("Registration Successful!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("Registration Failed:", err.response ? err.response.data : err.message);

      toast.error("Registration Failed! Please try again.", { position: "top-right", autoClose: 2000 });

    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await googleLoginUser({
              token: credentialResponse.credential,
              latitude: location.latitude,
              longitude: location.longitude
            });
            dispatch(login(response.user));
      toast.success("Google Registered Successful!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => {
        navigate("/home");
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Google Login Failed:", err);
      toast.error("Google Login Failed!", { position: "top-right", autoClose: 2000 });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign-Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">Or</p>
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                      toast.error("Google Login Failed!", { position: "top-right", autoClose: 2000 });
                    }}
                  />
        <p className="text-center mt-3">OR</p>

        <Link to="/login" className="block text-center text-blue-500 hover:underline">
          Login
        </Link>

      </div>
    </div>
  );
}

export default Register;
