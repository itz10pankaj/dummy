import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateForm } from "../redux/slices/FormSlice.js"

const Form = () => {
  const dispatch = useDispatch();
  const values = useSelector((state) => state.form);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ [name]: value })); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form>
        <div className="mb-4">
          <label className="block font-semibold">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={values.name}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={values.email}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={values.password}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
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
    </div>
  );
};

export default Form;