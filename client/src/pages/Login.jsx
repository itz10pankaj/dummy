import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser,googleLoginUser } from '../services/apiServices';
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [captcha, setCaptcha] = useState('');
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
  // Function to generate a random captcha
  const generateCaptcha = () => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(captchaText);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);
  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.captchaInput !== captcha) {
      toast.error("Captcha verification failed!", { position: "top-right", autoClose: 2000 });
      generateCaptcha();
      return;
    }

    try {
      const response = await loginUser({
        ...values,
        latitude: location.latitude,
        longitude: location.longitude
      });
      console.log("hehe",response)
      dispatch(login(response.user));
      toast.success("Login Successful!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => {
        navigate("/home")
        window.location.reload();
      }
        , 500);
    } catch (err) {
      console.log(err);
      toast.error("Invalid Credentials!", { position: "top-right", autoClose: 2000 });
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
      toast.success("Google Login Successful!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => {
        navigate("/home");
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Google Login Failed:", err);
      toast.error("Google Login Failed!", { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setValues({ ...values, email: e.target.value })}
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
              onChange={e => setValues({ ...values, password: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Captcha</label>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gray-200 font-bold rounded">{captcha}</span>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-blue-500 hover:underline"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              name="captcha"
              className="w-full px-3 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setValues({ ...values, captchaInput: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>

          <p className="text-center mt-3">Or</p>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => {
              toast.error("Google Login Failed!", { position: "top-right", autoClose: 2000 });
            }}
          />

          <p className="text-center mt-3">Or</p>

          <Link to="/register" className="block text-center text-blue-500 hover:underline">
            Register
          </Link>

        </form>
      </div>
    </div>
  );
}

export default Login;
