import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateForm } from "../redux/slices/FormSlice.js";
import BulkUploadFormIns from "../modals/Ins_Preium_Modal.jsx";
const Form = () => {
  const dispatch = useDispatch();
  const values = useSelector((state) => state.form);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "AadharNumber":
        if (!/^\d{12}$/.test(value)) error = "Aadhar must be 12 digits.";
        break;
      case "PanNumber":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value))
          error = "Invalid PAN format (e.g., ABCDE1234F).";
        break;
      case "Contact": {
        if (!/^\d{10}$/.test(value)) {
          error = "Contact must be exactly 10 digits (no letters or symbols).";
        }
        break;
      }
      case "text":
        if (!/^.*car.*$/i.test(value))
          error = 'Text must contain the word "car".';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ [name]: value }));
    validateField(name, value);
  }

return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <div className="mb-4">
        <label className="block font-semibold">Aadhar Number</label>
        <input
          type="text"
          name="AadharNumber"
          placeholder="Enter Aadhar Number"
          value={values.AadharNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          required
        />
        {errors.AadharNumber && (
          <p className="text-red-500 text-sm">{errors.AadharNumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">PAN Number</label>
        <input
          type="text"
          name="PanNumber"
          placeholder="Enter PAN Number"
          value={values.PanNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          required
        />
        {errors.PanNumber && (
          <p className="text-red-500 text-sm">{errors.PanNumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Contact</label>
        <div className="flex gap-2">
          <select
            className="border rounded px-2"
            value={values.countryCode}
            onChange={handleChange}
            name="countryCode"
            required
          >
            <option value="+91">+91 (IN)</option>
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
          </select>
          <input
            type="text"
            name="Contact"
            placeholder="Enter Contact"
            value={values.Contact}// Show only the local number
            onChange={handleChange}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
            required
          />
        </div>
        {errors.Contact && (
          <p className="text-red-500 text-sm">{errors.Contact}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Text</label>
        <input
          type="text"
          name="text"
          placeholder="Text must include 'car'"
          value={values.text}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none"
          required
        />
        {errors.text && <p className="text-red-500 text-sm">{errors.text}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
    <BulkUploadFormIns />
  </div>
);
};

export default Form;
